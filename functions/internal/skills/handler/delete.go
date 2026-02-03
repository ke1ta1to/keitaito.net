package handler

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
	"github.com/ke1ta1to/keitaito.net/functions/internal/skills"
)

type DeleteHandler struct {
	svc skills.ServiceInterface
}

func NewDeleteHandler(svc skills.ServiceInterface) *DeleteHandler {
	return &DeleteHandler{svc: svc}
}

func (h *DeleteHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["id"]
	if id == "" {
		return awsapigw.BadRequest("id is required")
	}

	err := h.svc.DeleteSkill(ctx, id)
	if err != nil {
		if errors.Is(err, awsdynamodb.ErrNotFound) {
			return awsapigw.NotFound(fmt.Sprintf("Skill not found (id: %s)", id))
		}
		return awsapigw.InternalServerError()
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusNoContent,
		Headers: map[string]string{
			"Access-Control-Allow-Origin": "*",
		},
	}, nil
}
