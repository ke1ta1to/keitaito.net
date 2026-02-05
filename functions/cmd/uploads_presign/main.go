package main

import (
	"context"
	"os"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/go-playground/validator/v10"
	"github.com/ke1ta1to/keitaito.net/functions/internal/uploads"
	"github.com/ke1ta1to/keitaito.net/functions/internal/uploads/handler"
)

func main() {
	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		panic(err)
	}
	s3Client := s3.NewFromConfig(cfg)
	presignClient := s3.NewPresignClient(s3Client)

	svc := uploads.NewService(presignClient, os.Getenv("BUCKET_NAME"))
	h := handler.NewPresignHandler(svc, validator.New())

	lambda.Start(h.Handle)
}
