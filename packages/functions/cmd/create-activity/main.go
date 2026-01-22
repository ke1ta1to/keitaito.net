package main

import (
	"context"
	"encoding/json"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/ke1ta1to/keitaito.net/functions/internal/activities"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
)

var (
	ddb       *dynamodb.Client
	tableName = os.Getenv("ACTIVITIES_TABLE_NAME")
	validate  = validator.New()
)

func init() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb = dynamodb.NewFromConfig(cfg)
}

type CreateActivityRequest struct {
	Title       string `json:"title" validate:"required"`
	Date        string `json:"date" validate:"required"`
	Description string `json:"description" validate:"required"`
}

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var createReq CreateActivityRequest
	if err := json.Unmarshal([]byte(req.Body), &createReq); err != nil {
		return awsapigw.BadRequest("invalid JSON")
	}

	if err := validate.Struct(createReq); err != nil {
		return awsapigw.BadRequest("title, date and description are required")
	}

	id := uuid.New().String()
	item := activities.Record{
		PK:          "ACTIVITY",
		SK:          id,
		Title:       createReq.Title,
		Date:        createReq.Date,
		Description: createReq.Description,
	}

	av, err := attributevalue.MarshalMap(item)
	if err != nil {
		return awsapigw.InternalServerError()
	}

	_, err = ddb.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item:      av,
	})
	if err != nil {
		return awsapigw.InternalServerError()
	}

	a := activities.Activity{
		ID:          id,
		Title:       item.Title,
		Date:        item.Date,
		Description: item.Description,
	}

	body, err := json.Marshal(a)
	if err != nil {
		return awsapigw.InternalServerError()
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusCreated,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(body),
	}, nil
}

func main() {
	lambda.Start(handler)
}
