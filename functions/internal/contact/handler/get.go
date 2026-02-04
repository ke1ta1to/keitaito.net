package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
	"github.com/ke1ta1to/keitaito.net/functions/internal/contact"
)

type GetHandler struct {
	svc contact.ServiceInterface
}

func NewGetHandler(svc contact.ServiceInterface) *GetHandler {
	return &GetHandler{svc: svc}
}

func (h *GetHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	c, err := h.svc.GetContact(ctx)
	if err != nil {
		if errors.Is(err, awsdynamodb.ErrNotFound) {
			return awsapigw.NotFound("Contact not found")
		}
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
