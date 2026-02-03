package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/profile"
)

type UpdateHandler struct {
	svc      profile.ServiceInterface
	validate *validator.Validate
}

type UpdateRequest struct {
	Name     string `json:"name" validate:"required"`
	Birthday string `json:"birthday" validate:"required"`
	Location string `json:"location" validate:"required"`
	School   string `json:"school" validate:"required"`
	ImageURL string `json:"image_url" validate:"required,url"`
	X        string `json:"x" validate:"required,url"`
	GitHub   string `json:"github" validate:"required,url"`
	Zenn     string `json:"zenn" validate:"required,url"`
	Qiita    string `json:"qiita" validate:"required,url"`
}

func NewUpdateHandler(svc profile.ServiceInterface, validate *validator.Validate) *UpdateHandler {
	return &UpdateHandler{svc: svc, validate: validate}
}

func (h *UpdateHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var updateReq UpdateRequest
	if err := json.Unmarshal([]byte(req.Body), &updateReq); err != nil {
		return awsapigw.BadRequest("invalid JSON")
	}

	if err := h.validate.Struct(updateReq); err != nil {
		return awsapigw.BadRequest("all fields are required and URLs must be valid")
	}

	p, err := h.svc.UpdateProfile(ctx, updateReq.Name, updateReq.Birthday, updateReq.Location, updateReq.School, updateReq.ImageURL, updateReq.X, updateReq.GitHub, updateReq.Zenn, updateReq.Qiita)
	if err != nil {
		return awsapigw.InternalServerError()
	}

	body, err := json.Marshal(p)
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
