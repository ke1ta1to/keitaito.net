package skills

import (
	"context"
	"errors"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/apiutil"
)

type DeleteHandler struct {
	repo Repository
}

func NewDeleteHandler(repo Repository) *DeleteHandler {
	return &DeleteHandler{repo: repo}
}

func (h *DeleteHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["id"]
	if id == "" {
		return apiutil.ErrorResponse(http.StatusBadRequest, "Missing id")
	}

	if err := h.repo.Delete(ctx, id); err != nil {
		if errors.Is(err, ErrNotFound) {
			return apiutil.ErrorResponse(http.StatusNotFound, "Not found")
		}
		return apiutil.ErrorResponse(http.StatusInternalServerError, "Failed to delete item")
	}
	return events.APIGatewayProxyResponse{StatusCode: http.StatusNoContent}, nil
}
