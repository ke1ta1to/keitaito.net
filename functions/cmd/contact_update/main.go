package main

import (
	"context"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/contact"
	"github.com/ke1ta1to/keitaito.net/functions/internal/contact/handler"
)

func main() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb := dynamodb.NewFromConfig(cfg)

	repo := contact.NewDynamoDBRepository(ddb, os.Getenv("CONTACT_TABLE_NAME"))
	svc := contact.NewService(repo)
	h := handler.NewUpdateHandler(svc, validator.New())

	lambda.Start(h.Handle)
}
