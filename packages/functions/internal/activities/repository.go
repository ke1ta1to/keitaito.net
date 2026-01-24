package activities

//go:generate mockgen -source=repository.go -destination=repository_mock.go -package=activities

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
	Get(ctx context.Context, id string) (*Activity, error)
	List(ctx context.Context) ([]Activity, error)
	Create(ctx context.Context, a *Activity) error
	Update(ctx context.Context, a *Activity) error
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

func (r *DynamoDBRepository) Get(ctx context.Context, id string) (*Activity, error) {
	out, err := r.client.Query(ctx, &dynamodb.QueryInput{
		TableName:              aws.String(r.tableName),
		KeyConditionExpression: aws.String("pk = :pk AND sk = :sk"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: "ACTIVITY"},
			":sk": &types.AttributeValueMemberS{Value: id},
		},
	})
	if err != nil {
		return nil, err
	}

	if len(out.Items) == 0 {
		return nil, awsdynamodb.ErrNotFound
	}

	var rec Record
	if err := attributevalue.UnmarshalMap(out.Items[0], &rec); err != nil {
		return nil, err
	}

	return &Activity{
		ID:          rec.SK,
		Title:       rec.Title,
		Date:        rec.Date,
		Description: rec.Description,
	}, nil
}

func (r *DynamoDBRepository) List(ctx context.Context) ([]Activity, error) {
	out, err := r.client.Query(ctx, &dynamodb.QueryInput{
		TableName:              aws.String(r.tableName),
		KeyConditionExpression: aws.String("pk = :pk"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: "ACTIVITY"},
		},
	})
	if err != nil {
		return nil, err
	}

	var records []Record
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &records); err != nil {
		return nil, err
	}

	result := make([]Activity, len(records))
	for i, rec := range records {
		result[i] = Activity{
			ID:          rec.SK,
			Title:       rec.Title,
			Date:        rec.Date,
			Description: rec.Description,
		}
	}

	// Sort by date descending
	sort.Slice(result, func(i, j int) bool {
		return result[i].Date > result[j].Date
	})

	return result, nil
}

func (r *DynamoDBRepository) Create(ctx context.Context, a *Activity) error {
	rec := Record{
		PK:          "ACTIVITY",
		SK:          a.ID,
		Title:       a.Title,
		Date:        a.Date,
		Description: a.Description,
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

func (r *DynamoDBRepository) Update(ctx context.Context, a *Activity) error {
	_, err := r.client.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: "ACTIVITY"},
			"sk": &types.AttributeValueMemberS{Value: a.ID},
		},
		UpdateExpression:    aws.String("SET title = :title, #date = :date, description = :description"),
		ConditionExpression: aws.String("attribute_exists(pk)"),
		ExpressionAttributeNames: map[string]string{
			"#date": "date",
		},
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":title":       &types.AttributeValueMemberS{Value: a.Title},
			":date":        &types.AttributeValueMemberS{Value: a.Date},
			":description": &types.AttributeValueMemberS{Value: a.Description},
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
			"pk": &types.AttributeValueMemberS{Value: "ACTIVITY"},
			"sk": &types.AttributeValueMemberS{Value: id},
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
