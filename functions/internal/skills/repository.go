package skills

//go:generate mockgen -source=repository.go -destination=repository_mock.go -package=skills

import (
	"context"
	"errors"
	"sort"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
)

type Repository interface {
	Get(ctx context.Context, id string) (*Skill, error)
	List(ctx context.Context) ([]Skill, error)
	Create(ctx context.Context, s *Skill) error
	Update(ctx context.Context, s *Skill) error
	Delete(ctx context.Context, id string) error
}

type DynamoDBRepository struct {
	client    awsdynamodb.Client
	tableName string
}

func NewDynamoDBRepository(client awsdynamodb.Client, tableName string) *DynamoDBRepository {
	return &DynamoDBRepository{
		client:    client,
		tableName: tableName,
	}
}

func (r *DynamoDBRepository) Get(ctx context.Context, id string) (*Skill, error) {
	out, err := r.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: id},
		},
	})
	if err != nil {
		return nil, err
	}

	if out.Item == nil {
		return nil, awsdynamodb.ErrNotFound
	}

	var rec Record
	if err := attributevalue.UnmarshalMap(out.Item, &rec); err != nil {
		return nil, err
	}

	return &Skill{
		ID:      rec.PK,
		Name:    rec.Name,
		IconURL: rec.IconURL,
	}, nil
}

func (r *DynamoDBRepository) List(ctx context.Context) ([]Skill, error) {
	out, err := r.client.Scan(ctx, &dynamodb.ScanInput{
		TableName: aws.String(r.tableName),
	})
	if err != nil {
		return nil, err
	}

	var records []Record
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &records); err != nil {
		return nil, err
	}

	result := make([]Skill, len(records))
	for i, rec := range records {
		result[i] = Skill{
			ID:      rec.PK,
			Name:    rec.Name,
			IconURL: rec.IconURL,
		}
	}

	// Sort by name ascending
	sort.Slice(result, func(i, j int) bool {
		return result[i].Name < result[j].Name
	})

	return result, nil
}

func (r *DynamoDBRepository) Create(ctx context.Context, s *Skill) error {
	rec := Record{
		PK:      s.ID,
		Name:    s.Name,
		IconURL: s.IconURL,
	}

	av, err := attributevalue.MarshalMap(rec)
	if err != nil {
		return err
	}

	_, err = r.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(r.tableName),
		Item:      av,
	})
	return err
}

func (r *DynamoDBRepository) Update(ctx context.Context, s *Skill) error {
	_, err := r.client.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: s.ID},
		},
		UpdateExpression:    aws.String("SET #name = :name, icon_url = :icon_url"),
		ConditionExpression: aws.String("attribute_exists(pk)"),
		ExpressionAttributeNames: map[string]string{
			"#name": "name",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":name":     &types.AttributeValueMemberS{Value: s.Name},
			":icon_url": &types.AttributeValueMemberS{Value: s.IconURL},
		},
	})
	if err != nil {
		var conditionErr *types.ConditionalCheckFailedException
		if errors.As(err, &conditionErr) {
			return awsdynamodb.ErrNotFound
		}
		return err
	}
	return nil
}

func (r *DynamoDBRepository) Delete(ctx context.Context, id string) error {
	_, err := r.client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: id},
		},
		ConditionExpression: aws.String("attribute_exists(pk)"),
	})
	if err != nil {
		var conditionErr *types.ConditionalCheckFailedException
		if errors.As(err, &conditionErr) {
			return awsdynamodb.ErrNotFound
		}
		return err
	}
	return nil
}
