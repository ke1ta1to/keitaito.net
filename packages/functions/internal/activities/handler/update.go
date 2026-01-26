package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/activities"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
)

type UpdateHandler struct {
	svc      activities.ServiceInterface
	validate *validator.Validate
}

type UpdateRequest struct {
	Title       string `json:"title" validate:"required"`
	Date        string `json:"date" validate:"required"`
	Description string `json:"description" validate:"required"`
}

func NewUpdateHandler(svc activities.ServiceInterface, validate *validator.Validate) *UpdateHandler {
	return &UpdateHandler{svc: svc, validate: validate}
}

func (h *UpdateHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["id"]

	var updateReq UpdateRequest
	if err := json.Unmarshal([]byte(req.Body), &updateReq); err != nil {
		return awsapigw.BadRequest("invalid JSON")
	}

	if err := h.validate.Struct(updateReq); err != nil {
		return awsapigw.BadRequest("title, date and description are required")
	}

	a, err := h.svc.UpdateActivity(ctx, id, updateReq.Title, updateReq.Date, updateReq.Description)
	if err != nil {
		if errors.Is(err, awsdynamodb.ErrNotFound) {
			return awsapigw.NotFound(fmt.Sprintf("Activity not found (id: %s)", id))
		}
		return awsapigw.InternalServerError()
	}

	body, err := json.Marshal(a)
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
