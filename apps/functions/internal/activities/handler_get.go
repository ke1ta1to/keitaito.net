package activities

import (
	"context"
	"errors"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/apiutil"
)

type GetHandler struct {
	repo Repository
}

func NewGetHandler(repo Repository) *GetHandler {
	return &GetHandler{repo: repo}
}

func (h *GetHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["id"]
	if id == "" {
		return apiutil.ErrorResponse(http.StatusBadRequest, "missing id")
	}

	activity, err := h.repo.Get(ctx, id)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			return apiutil.ErrorResponse(http.StatusNotFound, "not found")
		}
		return apiutil.ErrorResponse(http.StatusInternalServerError, "failed to get item")
	}
	return apiutil.JSONResponse(http.StatusOK, activity)
}
