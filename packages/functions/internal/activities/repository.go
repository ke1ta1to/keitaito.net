package activities

import (
	"context"
	"errors"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

var ErrNotFound = errors.New("activity not found")

type Repository interface {
	Get(ctx context.Context, id string) (*Activity, error)
}

type DynamoDBClient interface {
	Query(ctx context.Context, params *dynamodb.QueryInput, optFns ...func(*dynamodb.Options)) (*dynamodb.QueryOutput, error)
}

type DynamoDBRepository struct {
	client    DynamoDBClient
	tableName string
}

func NewDynamoDBRepository(client DynamoDBClient, tableName string) *DynamoDBRepository {
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
		return nil, ErrNotFound
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
