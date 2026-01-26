package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/activities"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
)

type CreateHandler struct {
	svc      *activities.Service
	validate *validator.Validate
}

type CreateRequest struct {
	Title       string `json:"title" validate:"required"`
	Date        string `json:"date" validate:"required"`
	Description string `json:"description" validate:"required"`
}

func NewCreateHandler(svc *activities.Service, validate *validator.Validate) *CreateHandler {
	return &CreateHandler{svc: svc, validate: validate}
}

func (h *CreateHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var createReq CreateRequest
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
