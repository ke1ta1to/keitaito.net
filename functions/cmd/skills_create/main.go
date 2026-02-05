package main

import (
	"context"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/skills"
	"github.com/ke1ta1to/keitaito.net/functions/internal/skills/handler"
)

func main() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb := dynamodb.NewFromConfig(cfg)

	repo := skills.NewDynamoDBRepository(ddb, os.Getenv("TABLE_NAME"))
	svc := skills.NewService(repo)
	h := handler.NewCreateHandler(svc, validator.New())

	lambda.Start(h.Handle)
}
