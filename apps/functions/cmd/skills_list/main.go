package main

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/db"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/skills"
)

func main() {
	client, err := db.NewClient(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	repo := skills.NewDynamoDBRepository(client, os.Getenv("SKILLS_TABLE"))
	h := skills.NewListHandler(repo)
	lambda.Start(h.Handle)
}
