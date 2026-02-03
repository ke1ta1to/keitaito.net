package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
	"github.com/ke1ta1to/keitaito.net/functions/internal/skills"
)

type GetHandler struct {
	svc skills.ServiceInterface
}

func NewGetHandler(svc skills.ServiceInterface) *GetHandler {
	return &GetHandler{svc: svc}
}

func (h *GetHandler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	id := req.PathParameters["id"]
	if id == "" {
		return awsapigw.BadRequest("id is required")
	}

	s, err := h.svc.GetSkill(ctx, id)
	if err != nil {
		if errors.Is(err, awsdynamodb.ErrNotFound) {
			return awsapigw.NotFound(fmt.Sprintf("Skill not found (id: %s)", id))
		}
		return awsapigw.InternalServerError()
	}

	body, err := json.Marshal(s)
	if err != nil {
		return awsapigw.InternalServerError()
	}

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(body),
	}, nil
}
