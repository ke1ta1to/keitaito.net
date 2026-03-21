package main

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/articles"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/db"
)

func main() {
	client, err := db.NewClient(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	repo := articles.NewDynamoDBRepository(client, os.Getenv("ARTICLES_TABLE"))
	h := articles.NewUpdateHandler(repo)
	lambda.Start(h.Handle)
}
