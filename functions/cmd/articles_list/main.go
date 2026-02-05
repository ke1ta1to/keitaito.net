package main

import (
	"context"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/ke1ta1to/keitaito.net/functions/internal/articles"
	"github.com/ke1ta1to/keitaito.net/functions/internal/articles/handler"
)

func main() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	ddb := dynamodb.NewFromConfig(cfg)

	repo := articles.NewDynamoDBRepository(ddb, os.Getenv("TABLE_NAME"))
	svc := articles.NewService(repo)
	h := handler.NewListHandler(svc)

	lambda.Start(h.Handle)
}
