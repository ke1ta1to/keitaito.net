package activities

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/apiutil"
)

type UpdateHandler struct {
	repo Repository
}

func NewUpdateHandler(repo Repository) *UpdateHandler {
	return &UpdateHandler{repo: repo}
}

func (h *UpdateHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["id"]
	if id == "" {
		return apiutil.ErrorResponse(http.StatusBadRequest, "Missing id")
	}

	var r UpdateRequest
	if err := json.Unmarshal([]byte(req.Body), &r); err != nil {
		return apiutil.ErrorResponse(http.StatusBadRequest, "Invalid request body")
	}
	if err := r.Validate(); err != nil {
		return apiutil.ErrorResponse(http.StatusBadRequest, err.Error())
	}

	activity := Activity{
		ID:          id,
		Title:       r.Title,
		Date:        r.Date,
		Description: r.Description,
	}

	if err := h.repo.Update(ctx, &activity); err != nil {
		if errors.Is(err, ErrNotFound) {
			return apiutil.ErrorResponse(http.StatusNotFound, "Not found")
		}
		return apiutil.ErrorResponse(http.StatusInternalServerError, "Failed to update item")
	}
	return apiutil.JSONResponse(http.StatusOK, activity)
}
