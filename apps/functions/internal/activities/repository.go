package activities

import (
	"context"
	"errors"
	"time"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

var ErrNotFound = errors.New("item not found")

//go:generate mockgen -typed -destination=repository_mock_test.go -package=activities . Repository

type Repository interface {
	List(ctx context.Context) ([]Activity, error)
	Get(ctx context.Context, id string) (*Activity, error)
	Create(ctx context.Context, activity *Activity) error
	Update(ctx context.Context, activity *Activity) error
	Delete(ctx context.Context, id string) error
}

type activityItem struct {
	PK          string `dynamodbav:"pk"`
	Title       string `dynamodbav:"title"`
	Date        string `dynamodbav:"date"`
	Description string `dynamodbav:"description"`
	CreatedAt   string `dynamodbav:"createdAt"`
	UpdatedAt   string `dynamodbav:"updatedAt"`
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

func (r *DynamoDBRepository) List(ctx context.Context) ([]Activity, error) {
	out, err := r.client.Scan(ctx, &dynamodb.ScanInput{
		TableName: &r.tableName,
	})
	if err != nil {
		return nil, err
	}

	var items []activityItem
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &items); err != nil {
		return nil, err
	}

	activities := make([]Activity, len(items))
	for i := range items {
		createdAt, _ := time.Parse(time.RFC3339, items[i].CreatedAt)
		updatedAt, _ := time.Parse(time.RFC3339, items[i].UpdatedAt)
		activities[i] = Activity{
			ID:          items[i].PK,
			Title:       items[i].Title,
			Date:        items[i].Date,
			Description: items[i].Description,
			CreatedAt:   createdAt,
			UpdatedAt:   updatedAt,
		}
	}
	return activities, nil
}

func (r *DynamoDBRepository) Get(ctx context.Context, id string) (*Activity, error) {
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

	var item activityItem
	if err := attributevalue.UnmarshalMap(out.Item, &item); err != nil {
		return nil, err
	}
	createdAt, _ := time.Parse(time.RFC3339, item.CreatedAt)
	updatedAt, _ := time.Parse(time.RFC3339, item.UpdatedAt)
	return &Activity{
		ID:          item.PK,
		Title:       item.Title,
		Date:        item.Date,
		Description: item.Description,
		CreatedAt:   createdAt,
		UpdatedAt:   updatedAt,
	}, nil
}

func (r *DynamoDBRepository) Create(ctx context.Context, activity *Activity) error {
	now := time.Now().UTC()
	activity.CreatedAt = now
	activity.UpdatedAt = now

	item, err := attributevalue.MarshalMap(&activityItem{
		PK:          activity.ID,
		Title:       activity.Title,
		Date:        activity.Date,
		Description: activity.Description,
		CreatedAt:   activity.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   activity.UpdatedAt.Format(time.RFC3339),
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

func (r *DynamoDBRepository) Update(ctx context.Context, activity *Activity) error {
	existing, err := r.Get(ctx, activity.ID)
	if err != nil {
		return err
	}

	activity.CreatedAt = existing.CreatedAt
	activity.UpdatedAt = time.Now().UTC()

	item, err := attributevalue.MarshalMap(&activityItem{
		PK:          activity.ID,
		Title:       activity.Title,
		Date:        activity.Date,
		Description: activity.Description,
		CreatedAt:   activity.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   activity.UpdatedAt.Format(time.RFC3339),
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
