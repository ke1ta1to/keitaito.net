package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/apigw"
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

type UpdateActivityRequest struct {
	Title string `json:"title" validate:"required"`
}

type Activity struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["id"]

	var updateReq UpdateActivityRequest
	if err := json.Unmarshal([]byte(req.Body), &updateReq); err != nil {
		return apigw.BadRequest("invalid JSON")
	}

	if err := validate.Struct(updateReq); err != nil {
		return apigw.BadRequest("title is required")
	}

	out, err := ddb.UpdateItem(ctx, &dynamodb.UpdateItemInput{
		TableName: aws.String(tableName),
		Key: map[string]types.AttributeValue{
			"pk": &types.AttributeValueMemberS{Value: "ACTIVITY"},
			"sk": &types.AttributeValueMemberS{Value: id},
		},
		UpdateExpression:    aws.String("SET title = :title"),
		ConditionExpression: aws.String("attribute_exists(pk)"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":title": &types.AttributeValueMemberS{Value: updateReq.Title},
		},
		ReturnValues: types.ReturnValueAllNew,
	})
	if err != nil {
		var conditionErr *types.ConditionalCheckFailedException
		if errors.As(err, &conditionErr) {
			return apigw.NotFound(fmt.Sprintf("Activity not found (id: %s)", id))
		}
		return apigw.InternalServerError()
	}

	activity := Activity{
		ID:    id,
		Title: out.Attributes["title"].(*types.AttributeValueMemberS).Value,
	}

	body, err := json.Marshal(activity)
	if err != nil {
		return apigw.InternalServerError()
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
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
