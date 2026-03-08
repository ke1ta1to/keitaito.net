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

func toItem(a *Activity) *activityItem {
	return &activityItem{
		PK:          a.ID,
		Title:       a.Title,
		Date:        a.Date,
		Description: a.Description,
		CreatedAt:   a.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   a.UpdatedAt.Format(time.RFC3339),
	}
}

func (i *activityItem) toActivity() *Activity {
	createdAt, _ := time.Parse(time.RFC3339, i.CreatedAt)
	updatedAt, _ := time.Parse(time.RFC3339, i.UpdatedAt)
	return &Activity{
		ID:          i.PK,
		Title:       i.Title,
		Date:        i.Date,
		Description: i.Description,
		CreatedAt:   createdAt,
		UpdatedAt:   updatedAt,
	}
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
		activities[i] = *items[i].toActivity()
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
	return item.toActivity(), nil
}

func (r *DynamoDBRepository) Create(ctx context.Context, activity *Activity) error {
	now := time.Now().UTC()
	activity.CreatedAt = now
	activity.UpdatedAt = now

	item, err := attributevalue.MarshalMap(toItem(activity))
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

	item, err := attributevalue.MarshalMap(toItem(activity))
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
