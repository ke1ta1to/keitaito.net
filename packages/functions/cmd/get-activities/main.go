package main

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"sort"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/ke1ta1to/keitaito.net/functions/internal/activity"
	"github.com/ke1ta1to/keitaito.net/functions/internal/apigw"
)

var (
	ddb       *dynamodb.Client
	tableName = os.Getenv("ACTIVITIES_TABLE_NAME")
)

func init() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb = dynamodb.NewFromConfig(cfg)
}

func handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	out, err := ddb.Query(ctx, &dynamodb.QueryInput{
		TableName:              aws.String(tableName),
		KeyConditionExpression: aws.String("pk = :pk"),
		ExpressionAttributeValues: map[string]types.AttributeValue{
			":pk": &types.AttributeValueMemberS{Value: "ACTIVITY"},
		},
	})
	if err != nil {
		return apigw.InternalServerError()
	}

	var items []activity.Item
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &items); err != nil {
		return apigw.InternalServerError()
	}

	activities := make([]activity.Activity, len(items))
	for i, item := range items {
		activities[i] = activity.Activity{
			ID:          item.SK,
			Title:       item.Title,
			Date:        item.Date,
			Description: item.Description,
		}
	}

	// Sort by date descending
	sort.Slice(activities, func(i, j int) bool {
		return activities[i].Date > activities[j].Date
	})

	body, err := json.Marshal(activities)
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
