package works

//go:generate mockgen -source=repository.go -destination=repository_mock.go -package=works

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
	Get(ctx context.Context, id string) (*Work, error)
	List(ctx context.Context) ([]Work, error)
	Create(ctx context.Context, w *Work) error
	Update(ctx context.Context, w *Work) error
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

func (r *DynamoDBRepository) Get(ctx context.Context, id string) (*Work, error) {
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

	return &Work{
		ID:        rec.PK,
		Title:     rec.Title,
		Slug:      rec.Slug,
		Content:   rec.Content,
		Thumbnail: rec.Thumbnail,
	}, nil
}

func (r *DynamoDBRepository) List(ctx context.Context) ([]Work, error) {
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

	result := make([]Work, len(records))
	for i, rec := range records {
		result[i] = Work{
			ID:        rec.PK,
			Title:     rec.Title,
			Slug:      rec.Slug,
			Content:   rec.Content,
			Thumbnail: rec.Thumbnail,
		}
	}

	// Sort by title alphabetically
	sort.Slice(result, func(i, j int) bool {
		return result[i].Title < result[j].Title
	})

	return result, nil
}

func (r *DynamoDBRepository) Create(ctx context.Context, w *Work) error {
	rec := Record{
		PK:        w.ID,
		Title:     w.Title,
		Slug:      w.Slug,
		Content:   w.Content,
		Thumbnail: w.Thumbnail,
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

func (r *DynamoDBRepository) Update(ctx context.Context, w *Work) error {
	_, err := r.client.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: w.ID},
		},
		UpdateExpression:    aws.String("SET title = :title, slug = :slug, content = :content, thumbnail = :thumbnail"),
		ConditionExpression: aws.String("attribute_exists(pk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":title":     &types.AttributeValueMemberS{Value: w.Title},
			":slug":      &types.AttributeValueMemberS{Value: w.Slug},
			":content":   &types.AttributeValueMemberS{Value: w.Content},
			":thumbnail": &types.AttributeValueMemberS{Value: w.Thumbnail},
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
