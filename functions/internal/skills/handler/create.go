package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/skills"
)

type CreateHandler struct {
	svc      skills.ServiceInterface
	validate *validator.Validate
}

type CreateRequest struct {
	Name    string `json:"name" validate:"required"`
	IconURL string `json:"icon_url" validate:"required"`
}

func NewCreateHandler(svc skills.ServiceInterface, validate *validator.Validate) *CreateHandler {
	return &CreateHandler{svc: svc, validate: validate}
}

func (h *CreateHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var createReq CreateRequest
	if err := json.Unmarshal([]byte(req.Body), &createReq); err != nil {
		return awsapigw.BadRequest("invalid JSON")
	}

	if err := h.validate.Struct(createReq); err != nil {
		return awsapigw.BadRequest("name and icon_url are required")
	}

	s, err := h.svc.CreateSkill(ctx, createReq.Name, createReq.IconURL)
	if err != nil {
		return awsapigw.InternalServerError()
	}

	body, err := json.Marshal(s)
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
