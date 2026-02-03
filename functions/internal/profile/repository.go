package profile

//go:generate mockgen -source=repository.go -destination=repository_mock.go -package=profile

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
)

type Repository interface {
	Get(ctx context.Context) (*Profile, error)
	Update(ctx context.Context, p *Profile) error
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

func (r *DynamoDBRepository) Get(ctx context.Context) (*Profile, error) {
	out, err := r.client.Query(ctx, &dynamodb.QueryInput{
		TableName:              aws.String(r.tableName),
		KeyConditionExpression: aws.String("pk = :pk AND sk = :sk"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: "PROFILE"},
			":sk": &types.AttributeValueMemberS{Value: "default"},
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

	return &Profile{
		Name:     rec.Name,
		Birthday: rec.Birthday,
		Location: rec.Location,
		School:   rec.School,
		ImageURL: rec.ImageURL,
		X:        rec.X,
		GitHub:   rec.GitHub,
		Zenn:     rec.Zenn,
		Qiita:    rec.Qiita,
	}, nil
}

func (r *DynamoDBRepository) Update(ctx context.Context, p *Profile) error {
	rec := Record{
		PK:       "PROFILE",
		SK:       "default",
		Name:     p.Name,
		Birthday: p.Birthday,
		Location: p.Location,
		School:   p.School,
		ImageURL: p.ImageURL,
		X:        p.X,
		GitHub:   p.GitHub,
		Zenn:     p.Zenn,
		Qiita:    p.Qiita,
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
