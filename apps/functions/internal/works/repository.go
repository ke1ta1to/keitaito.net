package works

import (
	"context"
	"errors"
	"time"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

var ErrNotFound = errors.New("item not found")

//go:generate mockgen -typed -destination=repository_mock_test.go -package=works . Repository

type Repository interface {
	List(ctx context.Context) ([]Work, error)
	Get(ctx context.Context, id string) (*Work, error)
	Create(ctx context.Context, work *Work) error
	Update(ctx context.Context, work *Work) error
	Delete(ctx context.Context, id string) error
}

type workItem struct {
	PK           string  `dynamodbav:"pk"`
	Title        string  `dynamodbav:"title"`
	Slug         string  `dynamodbav:"slug"`
	Content      string  `dynamodbav:"content"`
	ThumbnailURL *string `dynamodbav:"thumbnailUrl,omitempty"`
	CreatedAt    string  `dynamodbav:"createdAt"`
	UpdatedAt    string  `dynamodbav:"updatedAt"`
}

type DynamoDBRepository struct {
	client    *dynamodb.Client
	tableName string
}

func NewDynamoDBRepository(client *dynamodb.Client, tableName string) *DynamoDBRepository {
	return &DynamoDBRepository{
		client:    client,
		tableName: tableName,
	}
}

func (r *DynamoDBRepository) List(ctx context.Context) ([]Work, error) {
	out, err := r.client.Scan(ctx, &dynamodb.ScanInput{
		TableName: &r.tableName,
	})
	if err != nil {
		return nil, err
	}

	var items []workItem
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &items); err != nil {
		return nil, err
	}

	works := make([]Work, len(items))
	for i := range items {
		createdAt, _ := time.Parse(time.RFC3339, items[i].CreatedAt)
		updatedAt, _ := time.Parse(time.RFC3339, items[i].UpdatedAt)
		works[i] = Work{
			ID:           items[i].PK,
			Title:        items[i].Title,
			Slug:         items[i].Slug,
			Content:      items[i].Content,
			ThumbnailURL: items[i].ThumbnailURL,
			CreatedAt:    createdAt,
			UpdatedAt:    updatedAt,
		}
	}
	return works, nil
}

func (r *DynamoDBRepository) Get(ctx context.Context, id string) (*Work, error) {
	out, err := r.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: id},
		},
	})
	if err != nil {
		return nil, err
	}
	if out.Item == nil {
		return nil, ErrNotFound
	}

	var item workItem
	if err := attributevalue.UnmarshalMap(out.Item, &item); err != nil {
		return nil, err
	}
	createdAt, _ := time.Parse(time.RFC3339, item.CreatedAt)
	updatedAt, _ := time.Parse(time.RFC3339, item.UpdatedAt)
	return &Work{
		ID:           item.PK,
		Title:        item.Title,
		Slug:         item.Slug,
		Content:      item.Content,
		ThumbnailURL: item.ThumbnailURL,
		CreatedAt:    createdAt,
		UpdatedAt:    updatedAt,
	}, nil
}

func (r *DynamoDBRepository) Create(ctx context.Context, work *Work) error {
	now := time.Now().UTC()
	work.CreatedAt = now
	work.UpdatedAt = now

	item, err := attributevalue.MarshalMap(&workItem{
		PK:           work.ID,
		Title:        work.Title,
		Slug:         work.Slug,
		Content:      work.Content,
		ThumbnailURL: work.ThumbnailURL,
		CreatedAt:    work.CreatedAt.Format(time.RFC3339),
		UpdatedAt:    work.UpdatedAt.Format(time.RFC3339),
	})
	if err != nil {
		return err
	}

	_, err = r.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &r.tableName,
		Item:      item,
	})
	return err
}

func (r *DynamoDBRepository) Update(ctx context.Context, work *Work) error {
	existing, err := r.Get(ctx, work.ID)
	if err != nil {
		return err
	}

	work.CreatedAt = existing.CreatedAt
	work.UpdatedAt = time.Now().UTC()

	item, err := attributevalue.MarshalMap(&workItem{
		PK:           work.ID,
		Title:        work.Title,
		Slug:         work.Slug,
		Content:      work.Content,
		ThumbnailURL: work.ThumbnailURL,
		CreatedAt:    work.CreatedAt.Format(time.RFC3339),
		UpdatedAt:    work.UpdatedAt.Format(time.RFC3339),
	})
	if err != nil {
		return err
	}

	_, err = r.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &r.tableName,
		Item:      item,
	})
	return err
}

func (r *DynamoDBRepository) Delete(ctx context.Context, id string) error {
	condition := "attribute_exists(pk)"
	_, err := r.client.DeleteItem(ctx, &dynamodb.DeleteItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: id},
		},
		ConditionExpression: &condition,
	})
	var condErr *types.ConditionalCheckFailedException
	if errors.As(err, &condErr) {
		return ErrNotFound
	}
	return err
}
