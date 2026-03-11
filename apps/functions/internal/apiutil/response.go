package apiutil

import (
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
)

func JSONResponse(status int, body any) (events.APIGatewayProxyResponse, error) {
	b, err := json.Marshal(body)
	if err != nil {
		return ErrorResponse(http.StatusInternalServerError, "Internal server error")
	}
	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(b),
	}, nil
}

func ErrorResponse(status int, msg string) (events.APIGatewayProxyResponse, error) {
	body, _ := json.Marshal(map[string]string{"message": msg})
	return events.APIGatewayProxyResponse{
		StatusCode: status,
		Headers:    map[string]string{"Content-Type": "application/json"},
		Body:       string(body),
	}, nil
}
