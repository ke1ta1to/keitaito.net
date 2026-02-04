package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/works"
)

type CreateHandler struct {
	svc      works.ServiceInterface
	validate *validator.Validate
}

type CreateRequest struct {
	Title     string `json:"title" validate:"required"`
	Slug      string `json:"slug" validate:"required"`
	Content   string `json:"content" validate:"required"`
	Thumbnail string `json:"thumbnail" validate:"required"`
}

func NewCreateHandler(svc works.ServiceInterface, validate *validator.Validate) *CreateHandler {
	return &CreateHandler{svc: svc, validate: validate}
}

func (h *CreateHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var createReq CreateRequest
	if err := json.Unmarshal([]byte(req.Body), &createReq); err != nil {
		return awsapigw.BadRequest("invalid JSON")
	}

	if err := h.validate.Struct(createReq); err != nil {
		return awsapigw.BadRequest("title, slug, content and thumbnail are required")
	}

	w, err := h.svc.CreateWork(ctx, createReq.Title, createReq.Slug, createReq.Content, createReq.Thumbnail)
	if err != nil {
		return awsapigw.InternalServerError()
	}

	body, err := json.Marshal(w)
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
