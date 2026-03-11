package skills

import (
	"context"
	"errors"
	"time"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

var ErrNotFound = errors.New("item not found")

//go:generate mockgen -typed -destination=repository_mock_test.go -package=skills . Repository

type Repository interface {
	List(ctx context.Context) ([]Skill, error)
	Get(ctx context.Context, id string) (*Skill, error)
	Create(ctx context.Context, skill *Skill) error
	Update(ctx context.Context, skill *Skill) error
	Delete(ctx context.Context, id string) error
}

type skillItem struct {
	PK        string `dynamodbav:"pk"`
	Name      string `dynamodbav:"name"`
	IconURL   string `dynamodbav:"iconURL"`
	CreatedAt string `dynamodbav:"createdAt"`
	UpdatedAt string `dynamodbav:"updatedAt"`
}

func toItem(s *Skill) *skillItem {
	return &skillItem{
		PK:        s.ID,
		Name:      s.Name,
		IconURL:   s.IconURL,
		CreatedAt: s.CreatedAt.Format(time.RFC3339),
		UpdatedAt: s.UpdatedAt.Format(time.RFC3339),
	}
}

func (i *skillItem) toSkill() *Skill {
	createdAt, _ := time.Parse(time.RFC3339, i.CreatedAt)
	updatedAt, _ := time.Parse(time.RFC3339, i.UpdatedAt)
	return &Skill{
		ID:        i.PK,
		Name:      i.Name,
		IconURL:   i.IconURL,
		CreatedAt: createdAt,
		UpdatedAt: updatedAt,
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

func (r *DynamoDBRepository) List(ctx context.Context) ([]Skill, error) {
	out, err := r.client.Scan(ctx, &dynamodb.ScanInput{
		TableName: &r.tableName,
	})
	if err != nil {
		return nil, err
	}

	var items []skillItem
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &items); err != nil {
		return nil, err
	}

	skills := make([]Skill, len(items))
	for i := range items {
		skills[i] = *items[i].toSkill()
	}
	return skills, nil
}

func (r *DynamoDBRepository) Get(ctx context.Context, id string) (*Skill, error) {
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

	var item skillItem
	if err := attributevalue.UnmarshalMap(out.Item, &item); err != nil {
		return nil, err
	}
	return item.toSkill(), nil
}

func (r *DynamoDBRepository) Create(ctx context.Context, skill *Skill) error {
	now := time.Now().UTC()
	skill.CreatedAt = now
	skill.UpdatedAt = now

	item, err := attributevalue.MarshalMap(toItem(skill))
	if err != nil {
		return err
	}

	_, err = r.client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &r.tableName,
		Item:      item,
	})
	return err
}

func (r *DynamoDBRepository) Update(ctx context.Context, skill *Skill) error {
	existing, err := r.Get(ctx, skill.ID)
	if err != nil {
		return err
	}

	skill.CreatedAt = existing.CreatedAt
	skill.UpdatedAt = time.Now().UTC()

	item, err := attributevalue.MarshalMap(toItem(skill))
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
