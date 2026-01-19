package apigw

import (
	"encoding/json"
	"net/http"

	"github.com/aws/aws-lambda-go/events"
)

type ErrorResponse struct {
	Message string `json:"message"`
}

func InternalServerError() (events.APIGatewayProxyResponse, error) {
	body, _ := json.Marshal(ErrorResponse{Message: "Internal Server Error"})
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusInternalServerError,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(body),
	}, nil
}

func NotFound(message string) (events.APIGatewayProxyResponse, error) {
	body, _ := json.Marshal(ErrorResponse{Message: message})
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusNotFound,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(body),
	}, nil
}

func BadRequest(message string) (events.APIGatewayProxyResponse, error) {
	body, _ := json.Marshal(ErrorResponse{Message: message})
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusBadRequest,
		Headers: map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		Body: string(body),
	}, nil
}
