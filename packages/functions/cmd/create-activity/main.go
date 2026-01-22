package main

import (
	"context"
	"encoding/json"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/activities"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
)

type Handler struct {
	svc      *activities.Service
	validate *validator.Validate
}

type CreateActivityRequest struct {
	Title       string `json:"title" validate:"required"`
	Date        string `json:"date" validate:"required"`
	Description string `json:"description" validate:"required"`
}

func (h *Handler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var createReq CreateActivityRequest
	if err := json.Unmarshal([]byte(req.Body), &createReq); err != nil {
		return awsapigw.BadRequest("invalid JSON")
	}

	if err := h.validate.Struct(createReq); err != nil {
		return awsapigw.BadRequest("title, date and description are required")
	}

	a, err := h.svc.CreateActivity(ctx, createReq.Title, createReq.Date, createReq.Description)
	if err != nil {
		return awsapigw.InternalServerError()
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
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb := dynamodb.NewFromConfig(cfg)

	repo := activities.NewDynamoDBRepository(ddb, os.Getenv("ACTIVITIES_TABLE_NAME"))
	svc := activities.NewService(repo)
	handler := &Handler{
		svc:      svc,
		validate: validator.New(),
	}

	lambda.Start(handler.Handle)
}
