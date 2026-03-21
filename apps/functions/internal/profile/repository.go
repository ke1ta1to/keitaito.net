package profile

import (
	"context"
	"errors"
	"time"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

var ErrNotFound = errors.New("item not found")

const profilePK = "profile"

//go:generate mockgen -typed -destination=repository_mock_test.go -package=profile . Repository

type Repository interface {
	Get(ctx context.Context) (*Profile, error)
	Put(ctx context.Context, profile *Profile) error
}

type profileItem struct {
	PK        string `dynamodbav:"pk"`
	Name      string `dynamodbav:"name"`
	Birthday  string `dynamodbav:"birthday"`
	Location  string `dynamodbav:"location"`
	School    string `dynamodbav:"school"`
	ImageURL  string `dynamodbav:"imageUrl"`
	Twitter   string `dynamodbav:"twitter"`
	Github    string `dynamodbav:"github"`
	Zenn      string `dynamodbav:"zenn"`
	Qiita     string `dynamodbav:"qiita"`
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

func (r *DynamoDBRepository) Get(ctx context.Context) (*Profile, error) {
	out, err := r.client.GetItem(ctx, &dynamodb.GetItemInput{
		TableName: &r.tableName,
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: profilePK},
		},
	})
	if err != nil {
		return nil, err
	}
	if out.Item == nil {
		return nil, ErrNotFound
	}

	var item profileItem
	if err := attributevalue.UnmarshalMap(out.Item, &item); err != nil {
		return nil, err
	}
	updatedAt, _ := time.Parse(time.RFC3339, item.UpdatedAt)
	return &Profile{
		Name:      item.Name,
		Birthday:  item.Birthday,
		Location:  item.Location,
		School:    item.School,
		ImageURL:  item.ImageURL,
		Twitter:   item.Twitter,
		Github:    item.Github,
		Zenn:      item.Zenn,
		Qiita:     item.Qiita,
		UpdatedAt: updatedAt,
	}, nil
}

func (r *DynamoDBRepository) Put(ctx context.Context, profile *Profile) error {
	profile.UpdatedAt = time.Now().UTC()

	item, err := attributevalue.MarshalMap(&profileItem{
		PK:        profilePK,
		Name:      profile.Name,
		Birthday:  profile.Birthday,
		Location:  profile.Location,
		School:    profile.School,
		ImageURL:  profile.ImageURL,
		Twitter:   profile.Twitter,
		Github:    profile.Github,
		Zenn:      profile.Zenn,
		Qiita:     profile.Qiita,
		UpdatedAt: profile.UpdatedAt.Format(time.RFC3339),
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
