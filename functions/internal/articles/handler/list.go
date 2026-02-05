package handler

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/ke1ta1to/keitaito.net/functions/internal/articles"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
)

type ListHandler struct {
	svc articles.ServiceInterface
}

func NewListHandler(svc articles.ServiceInterface) *ListHandler {
	return &ListHandler{svc: svc}
}

func (h *ListHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	list, err := h.svc.ListArticles(ctx)
	if err != nil {
		return awsapigw.InternalServerError()
	}

	body, err := json.Marshal(list)
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
