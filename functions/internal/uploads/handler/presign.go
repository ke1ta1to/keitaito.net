package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/uploads"
)

type PresignHandler struct {
	svc      uploads.ServiceInterface
	validate *validator.Validate
}

type PresignRequest struct {
	Filename    string `json:"filename" validate:"required"`
	ContentType string `json:"content_type" validate:"required"`
}

func NewPresignHandler(svc uploads.ServiceInterface, validate *validator.Validate) *PresignHandler {
	return &PresignHandler{svc: svc, validate: validate}
}

func (h *PresignHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var presignReq PresignRequest
	if err := json.Unmarshal([]byte(req.Body), &presignReq); err != nil {
		return awsapigw.BadRequest("invalid JSON")
	}

	if err := h.validate.Struct(presignReq); err != nil {
		return awsapigw.BadRequest("filename and content_type are required")
	}

	resp, err := h.svc.GeneratePresignedURL(ctx, presignReq.Filename, presignReq.ContentType)
	if err != nil {
		return awsapigw.InternalServerError()
	}

	body, err := json.Marshal(resp)
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
