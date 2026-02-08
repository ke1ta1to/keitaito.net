package uploads

import (
	"context"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awss3"
)

//go:generate mockgen -source=service.go -destination=service_mock.go -package=uploads

type ServiceInterface interface {
	GeneratePresignedURL(ctx context.Context, filename, contentType string) (*PresignResponse, error)
}

type Service struct {
	presignClient awss3.PresignClient
	bucketName    string
}

func NewService(presignClient awss3.PresignClient, bucketName string) *Service {
	return &Service{presignClient: presignClient, bucketName: bucketName}
}

func (s *Service) GeneratePresignedURL(ctx context.Context, filename, contentType string) (*PresignResponse, error) {
	key := fmt.Sprintf("%s/%s", uuid.New().String(), filename)

	putResult, err := s.presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket:      &s.bucketName,
		Key:         &key,
		ContentType: &contentType,
	}, func(opts *s3.PresignOptions) {
		opts.Expires = 15 * time.Minute
	})
	if err != nil {
		return nil, err
	}

	getResult, err := s.presignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: &s.bucketName,
		Key:    &key,
	}, func(opts *s3.PresignOptions) {
		opts.Expires = 15 * time.Minute
	})
	if err != nil {
		return nil, err
	}

	return &PresignResponse{
		UploadURL:   putResult.URL,
		DownloadURL: getResult.URL,
		Key:         key,
	}, nil
}
