package articles

//go:generate mockgen -source=repository.go -destination=repository_mock.go -package=articles

import (
	"context"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
)

type Repository interface {
	Get(ctx context.Context) ([]Article, error)
	Put(ctx context.Context, articles []Article) error
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

func (r *DynamoDBRepository) Get(ctx context.Context) ([]Article, error) {
	out, err := r.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: aws.String(r.tableName),
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: "LATEST"},
		},
	})
	if err != nil {
		return nil, err
	}

	if out.Item == nil {
		return []Article{}, nil
	}

	var rec Record
	if err := attributevalue.UnmarshalMap(out.Item, &rec); err != nil {
		return nil, err
	}

	articles := make([]Article, len(rec.Items))
	for i, item := range rec.Items {
		articles[i] = Article{
			Title:       item.Title,
			URL:         item.URL,
			LikedCount:  item.LikedCount,
			PublishedAt: item.PublishedAt,
			Source:      item.Source,
		}
	}

	return articles, nil
}

func (r *DynamoDBRepository) Put(ctx context.Context, articles []Article) error {
	items := make([]ArticleRecord, len(articles))
	for i, a := range articles {
		items[i] = ArticleRecord{
			Title:       a.Title,
			URL:         a.URL,
			LikedCount:  a.LikedCount,
			PublishedAt: a.PublishedAt,
			Source:      a.Source,
		}
	}

	rec := Record{
		PK:        "LATEST",
		Items:     items,
		UpdatedAt: time.Now().UTC().Format(time.RFC3339),
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
