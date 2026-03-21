package contact

import (
	"context"
	"errors"
	"time"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

var ErrNotFound = errors.New("item not found")

const contactPK = "contact"

//go:generate mockgen -typed -destination=repository_mock_test.go -package=contact . Repository

type Repository interface {
	Get(ctx context.Context) (*Contact, error)
	Put(ctx context.Context, contact *Contact) error
}

type contactItem struct {
	PK        string `dynamodbav:"pk"`
	Email     string `dynamodbav:"email"`
	Twitter   string `dynamodbav:"twitter"`
	UpdatedAt string `dynamodbav:"updatedAt"`
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

func (r *DynamoDBRepository) Get(ctx context.Context) (*Contact, error) {
	out, err := r.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: contactPK},
		},
	})
	if err != nil {
		return nil, err
	}
	if out.Item == nil {
		return nil, ErrNotFound
	}

	var item contactItem
	if err := attributevalue.UnmarshalMap(out.Item, &item); err != nil {
		return nil, err
	}
	updatedAt, _ := time.Parse(time.RFC3339, item.UpdatedAt)
	return &Contact{
		Email:     item.Email,
		Twitter:   item.Twitter,
		UpdatedAt: updatedAt,
	}, nil
}

func (r *DynamoDBRepository) Put(ctx context.Context, contact *Contact) error {
	contact.UpdatedAt = time.Now().UTC()

	item, err := attributevalue.MarshalMap(&contactItem{
		PK:        contactPK,
		Email:     contact.Email,
		Twitter:   contact.Twitter,
		UpdatedAt: contact.UpdatedAt.Format(time.RFC3339),
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
