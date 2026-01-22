package activities

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
)

type Repository interface {
	Get(ctx context.Context, id string) (*Activity, error)
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
