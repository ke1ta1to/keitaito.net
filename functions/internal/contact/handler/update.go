package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/contact"
)

type UpdateHandler struct {
	svc      contact.ServiceInterface
	validate *validator.Validate
}

type UpdateRequest struct {
	Email string `json:"email" validate:"required,email"`
	X     string `json:"x" validate:"required"`
}

func NewUpdateHandler(svc contact.ServiceInterface, validate *validator.Validate) *UpdateHandler {
	return &UpdateHandler{svc: svc, validate: validate}
}

func (h *UpdateHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var updateReq UpdateRequest
	if err := json.Unmarshal([]byte(req.Body), &updateReq); err != nil {
		return awsapigw.BadRequest("invalid JSON")
	}

	if err := h.validate.Struct(updateReq); err != nil {
		return awsapigw.BadRequest("email must be valid and x is required")
	}

	c, err := h.svc.UpdateContact(ctx, updateReq.Email, updateReq.X)
	if err != nil {
		return awsapigw.InternalServerError()
	}

	body, err := json.Marshal(c)
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
