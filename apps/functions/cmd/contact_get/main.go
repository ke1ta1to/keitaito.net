package main

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/contact"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/db"
)

func main() {
	client, err := db.NewClient(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	repo := contact.NewDynamoDBRepository(client, os.Getenv("CONTACT_TABLE"))
	h := contact.NewGetHandler(repo)
	lambda.Start(h.Handle)
}
