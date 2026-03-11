package skills

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/google/uuid"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/apiutil"
)

type CreateHandler struct {
	repo   Repository
	idFunc func() string
}

func NewCreateHandler(repo Repository) *CreateHandler {
	return &CreateHandler{repo: repo, idFunc: uuid.NewString}
}

func (h *CreateHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var r CreateRequest
	if err := json.Unmarshal([]byte(req.Body), &r); err != nil {
		return apiutil.ErrorResponse(http.StatusBadRequest, "invalid request body")
	}
	if err := r.Validate(); err != nil {
		return apiutil.ErrorResponse(http.StatusBadRequest, err.Error())
	}

	skill := r.ToSkill()
	skill.ID = h.idFunc()

	if err := h.repo.Create(ctx, &skill); err != nil {
		return apiutil.ErrorResponse(http.StatusInternalServerError, "failed to create item")
	}
	return apiutil.JSONResponse(http.StatusCreated, skill)
}
