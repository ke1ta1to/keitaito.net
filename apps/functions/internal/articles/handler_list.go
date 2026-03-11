package articles

import (
	"context"
	"net/http"
	"slices"
	"strings"

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
	slices.SortFunc(items, func(a, b Article) int {
		if a.PublishedAt != b.PublishedAt {
			return strings.Compare(b.PublishedAt, a.PublishedAt) // published_at 降順
		}
		return a.CreatedAt.Compare(b.CreatedAt) // createdAt 昇順
	})
	return apiutil.JSONResponse(http.StatusOK, items)
}
