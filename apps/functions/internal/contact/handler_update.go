package contact

import (
	"context"
	"encoding/json"
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
	var r UpdateRequest
	if err := json.Unmarshal([]byte(req.Body), &r); err != nil {
		return apiutil.ErrorResponse(http.StatusBadRequest, "Invalid request body")
	}
	if err := r.Validate(); err != nil {
		return apiutil.ErrorResponse(http.StatusBadRequest, err.Error())
	}

	c := Contact{
		Email:   r.Email,
		Twitter: r.Twitter,
	}

	if err := h.repo.Put(ctx, &c); err != nil {
		return apiutil.ErrorResponse(http.StatusInternalServerError, "Failed to update item")
	}
	return apiutil.JSONResponse(http.StatusOK, c)
}
