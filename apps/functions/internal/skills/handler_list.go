package skills

import (
	"context"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/apiutil"
)

type ListHandler struct {
	repo Repository
}

func NewListHandler(repo Repository) *ListHandler {
	return &ListHandler{repo: repo}
}

func (h *ListHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	items, err := h.repo.List(ctx)
	if err != nil {
		return apiutil.ErrorResponse(http.StatusInternalServerError, "failed to scan table")
	}
	return apiutil.JSONResponse(http.StatusOK, items)
}
