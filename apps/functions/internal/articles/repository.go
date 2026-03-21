package articles

import (
	"context"
	"errors"
	"time"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

var ErrNotFound = errors.New("item not found")

//go:generate mockgen -typed -destination=repository_mock_test.go -package=articles . Repository

type Repository interface {
	List(ctx context.Context) ([]Article, error)
	Get(ctx context.Context, id string) (*Article, error)
	Create(ctx context.Context, article *Article) error
	Update(ctx context.Context, article *Article) error
	Delete(ctx context.Context, id string) error
}

type articleItem struct {
	PK          string  `dynamodbav:"pk"`
	Title       string  `dynamodbav:"title"`
	URL         string  `dynamodbav:"url"`
	LikedCount  int     `dynamodbav:"likedCount"`
	PublishedAt string  `dynamodbav:"publishedAt"`
	Source      *string `dynamodbav:"source,omitempty"`
	CreatedAt   string  `dynamodbav:"createdAt"`
	UpdatedAt   string  `dynamodbav:"updatedAt"`
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

func (r *DynamoDBRepository) List(ctx context.Context) ([]Article, error) {
	out, err := r.client.Scan(ctx, &dynamodb.ScanInput{
		TableName: &r.tableName,
	})
	if err != nil {
		return nil, err
	}

	var items []articleItem
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &items); err != nil {
		return nil, err
	}

	articles := make([]Article, len(items))
	for i := range items {
		createdAt, _ := time.Parse(time.RFC3339, items[i].CreatedAt)
		updatedAt, _ := time.Parse(time.RFC3339, items[i].UpdatedAt)
		articles[i] = Article{
			ID:          items[i].PK,
			Title:       items[i].Title,
			URL:         items[i].URL,
			LikedCount:  items[i].LikedCount,
			PublishedAt: items[i].PublishedAt,
			Source:      items[i].Source,
			CreatedAt:   createdAt,
			UpdatedAt:   updatedAt,
		}
	}
	return articles, nil
}

func (r *DynamoDBRepository) Get(ctx context.Context, id string) (*Article, error) {
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

	var item articleItem
	if err := attributevalue.UnmarshalMap(out.Item, &item); err != nil {
		return nil, err
	}
	createdAt, _ := time.Parse(time.RFC3339, item.CreatedAt)
	updatedAt, _ := time.Parse(time.RFC3339, item.UpdatedAt)
	return &Article{
		ID:          item.PK,
		Title:       item.Title,
		URL:         item.URL,
		LikedCount:  item.LikedCount,
		PublishedAt: item.PublishedAt,
		Source:      item.Source,
		CreatedAt:   createdAt,
		UpdatedAt:   updatedAt,
	}, nil
}

func (r *DynamoDBRepository) Create(ctx context.Context, article *Article) error {
	now := time.Now().UTC()
	article.CreatedAt = now
	article.UpdatedAt = now

	item, err := attributevalue.MarshalMap(&articleItem{
		PK:          article.ID,
		Title:       article.Title,
		URL:         article.URL,
		LikedCount:  article.LikedCount,
		PublishedAt: article.PublishedAt,
		Source:      article.Source,
		CreatedAt:   article.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   article.UpdatedAt.Format(time.RFC3339),
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

func (r *DynamoDBRepository) Update(ctx context.Context, article *Article) error {
	existing, err := r.Get(ctx, article.ID)
	if err != nil {
		return err
	}

	article.CreatedAt = existing.CreatedAt
	article.UpdatedAt = time.Now().UTC()

	item, err := attributevalue.MarshalMap(&articleItem{
		PK:          article.ID,
		Title:       article.Title,
		URL:         article.URL,
		LikedCount:  article.LikedCount,
		PublishedAt: article.PublishedAt,
		Source:      article.Source,
		CreatedAt:   article.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   article.UpdatedAt.Format(time.RFC3339),
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
