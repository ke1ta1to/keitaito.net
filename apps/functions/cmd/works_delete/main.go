package main

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/db"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/works"
)

func main() {
	client, err := db.NewClient(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	repo := works.NewDynamoDBRepository(client, os.Getenv("WORKS_TABLE"))
	h := works.NewDeleteHandler(repo)
	lambda.Start(h.Handle)
}
