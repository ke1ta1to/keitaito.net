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
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/ke1ta1to/keitaito.net/functions/internal/activities"
	"github.com/ke1ta1to/keitaito.net/functions/internal/apigw"
)

type Handler struct {
	svc *activities.Service
}

func (h *Handler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["id"]

	a, err := h.svc.GetActivity(ctx, id)
	if err != nil {
		if errors.Is(err, activities.ErrNotFound) {
			return apigw.NotFound(fmt.Sprintf("Activity not found (id: %s)", id))
		}
		return apigw.InternalServerError()
	}

	body, err := json.Marshal(a)
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
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb := dynamodb.NewFromConfig(cfg)

	repo := activities.NewDynamoDBRepository(ddb, os.Getenv("ACTIVITIES_TABLE_NAME"))
	svc := activities.NewService(repo)
	handler := &Handler{svc: svc}

	lambda.Start(handler.Handle)
}
