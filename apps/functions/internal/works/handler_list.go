package works

import (
	"context"
	"net/http"
	"slices"

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
		return apiutil.ErrorResponse(http.StatusInternalServerError, "Failed to scan table")
	}
	slices.SortFunc(items, func(a, b Work) int {
		return b.CreatedAt.Compare(a.CreatedAt)
	})
	return apiutil.JSONResponse(http.StatusOK, items)
}
