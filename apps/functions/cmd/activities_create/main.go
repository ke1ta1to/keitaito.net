package main

import (
	"context"
	"encoding/json"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/google/uuid"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/activities"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/db"
)

var client *dynamodb.Client

func init() {
	var err error
	client, err = db.NewClient(context.Background())
	if err != nil {
		panic(err)
	}
}

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var activity activities.Activity
	if err := json.Unmarshal([]byte(req.Body), &activity); err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusBadRequest,
			Body:       `{"error":"invalid request body"}`,
		}, nil
	}

	activity.ID = uuid.NewString()

	item, err := attributevalue.MarshalMap(activity)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       `{"error":"failed to marshal item"}`,
		}, nil
	}

	tableName := os.Getenv("ACTIVITIES_TABLE")
	_, err = client.PutItem(ctx, &dynamodb.PutItemInput{
		TableName: &tableName,
		Item:      item,
	})
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       `{"error":"failed to put item"}`,
		}, nil
	}

	resp, err := json.Marshal(activity)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       `{"error":"failed to marshal response"}`,
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusCreated,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(resp),
	}, nil
}

func main() {
	lambda.Start(Handler)
}
