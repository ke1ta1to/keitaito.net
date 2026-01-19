package apigw

import (
	"net/http"

	"github.com/aws/aws-lambda-go/events"
)

func InternalServerError() (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusInternalServerError,
		Headers: map[string]string{
			"Content-Type": "text/plain; charset=utf-8",
		},
		Body: "Internal Server Error",
	}, nil
}
