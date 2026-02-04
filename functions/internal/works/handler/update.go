package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
	"github.com/ke1ta1to/keitaito.net/functions/internal/works"
)

type UpdateHandler struct {
	svc      works.ServiceInterface
	validate *validator.Validate
}

type UpdateRequest struct {
	Title     string `json:"title" validate:"required"`
	Slug      string `json:"slug" validate:"required"`
	Content   string `json:"content" validate:"required"`
	Thumbnail string `json:"thumbnail" validate:"required"`
}

func NewUpdateHandler(svc works.ServiceInterface, validate *validator.Validate) *UpdateHandler {
	return &UpdateHandler{svc: svc, validate: validate}
}

func (h *UpdateHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["id"]
	if id == "" {
		return awsapigw.BadRequest("id is required")
	}

	var updateReq UpdateRequest
	if err := json.Unmarshal([]byte(req.Body), &updateReq); err != nil {
		return awsapigw.BadRequest("invalid JSON")
	}

	if err := h.validate.Struct(updateReq); err != nil {
		return awsapigw.BadRequest("title, slug, content and thumbnail are required")
	}

	w, err := h.svc.UpdateWork(ctx, id, updateReq.Title, updateReq.Slug, updateReq.Content, updateReq.Thumbnail)
	if err != nil {
		if errors.Is(err, awsdynamodb.ErrNotFound) {
			return awsapigw.NotFound(fmt.Sprintf("Work not found (id: %s)", id))
		}
		return awsapigw.InternalServerError()
	}

	body, err := json.Marshal(w)
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
