package main

import (
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/activities"
)

func Handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	title := req.QueryStringParameters["title"]

	items := []activities.Activity{
		{ID: "1", Title: title, Date: "2026-01-01", Description: "First activity"},
		{ID: "2", Title: title, Date: "2026-02-01", Description: "Second activity"},
		{ID: "3", Title: title, Date: "2026-03-01", Description: "Third activity"},
	}

	resp, err := json.Marshal(items)
	if err != nil {
		return events.APIGatewayProxyResponse{
			StatusCode: http.StatusInternalServerError,
			Body:       `{"error":"failed to marshal response"}`,
		}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(resp),
	}, nil
}

func main() {
	lambda.Start(Handler)
}
