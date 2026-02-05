package handler

import (
	"context"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/ke1ta1to/keitaito.net/functions/internal/articles"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
)

type CollectHandler struct {
	svc articles.CollectorServiceInterface
}

func NewCollectHandler(svc articles.CollectorServiceInterface) *CollectHandler {
	return &CollectHandler{svc: svc}
}

func (h *CollectHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	if err := h.svc.Collect(ctx); err != nil {
		return awsapigw.InternalServerError()
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusNoContent,
		Headers: map[string]string{
			"Access-Control-Allow-Origin": "*",
		},
	}, nil
}
