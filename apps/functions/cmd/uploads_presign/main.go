package main

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/s3client"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/uploads"
)

func main() {
	client, err := s3client.NewClient(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	presigner := s3.NewPresignClient(client)
	h := uploads.NewHandler(presigner, os.Getenv("UPLOADS_BUCKET"))
	lambda.Start(h.Handle)
}
