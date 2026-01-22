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
	"github.com/ke1ta1to/keitaito.net/functions/internal/activities"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
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
		return awsapigw.InternalServerError()
	}

	var items []activities.Record
	if err := attributevalue.UnmarshalListOfMaps(out.Items, &items); err != nil {
		return awsapigw.InternalServerError()
	}

	result := make([]activities.Activity, len(items))
	for i, item := range items {
		result[i] = activities.Activity{
			ID:          item.SK,
			Title:       item.Title,
			Date:        item.Date,
			Description: item.Description,
		}
	}

	// Sort by date descending
	sort.Slice(result, func(i, j int) bool {
		return result[i].Date > result[j].Date
	})

	body, err := json.Marshal(result)
	if err != nil {
		return awsapigw.InternalServerError()
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
