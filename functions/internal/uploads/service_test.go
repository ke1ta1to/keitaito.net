package uploads

import (
	"context"
	"errors"
	"testing"

	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awss3"
	"go.uber.org/mock/gomock"
)

func TestNewService(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockClient := awss3.NewMockPresignClient(ctrl)

	svc := NewService(mockClient, "test-bucket")

	if svc == nil {
		t.Fatal("NewService() returned nil")
	}
	if svc.presignClient == nil {
		t.Error("NewService() did not set presignClient")
	}
	if svc.bucketName != "test-bucket" {
		t.Errorf("NewService() bucketName = %v, want test-bucket", svc.bucketName)
	}
}

func TestService_GeneratePresignedURL(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockClient := awss3.NewMockPresignClient(ctrl)

		mockClient.EXPECT().PresignPutObject(gomock.Any(), gomock.Any(), gomock.Any()).
			DoAndReturn(func(ctx context.Context, params *s3.PutObjectInput, optFns ...func(*s3.PresignOptions)) (*v4.PresignedHTTPRequest, error) {
				if *params.Bucket != "test-bucket" {
					t.Errorf("Bucket = %v, want test-bucket", *params.Bucket)
				}
				if *params.ContentType != "image/png" {
					t.Errorf("ContentType = %v, want image/png", *params.ContentType)
				}
				if params.Key == nil || *params.Key == "" {
					t.Error("Key is empty")
				}
				return &v4.PresignedHTTPRequest{
					URL: "https://s3.example.com/presigned-put-url",
				}, nil
			})
		mockClient.EXPECT().PresignGetObject(gomock.Any(), gomock.Any(), gomock.Any()).
			Return(&v4.PresignedHTTPRequest{
				URL: "https://s3.example.com/presigned-get-url",
			}, nil)

		svc := NewService(mockClient, "test-bucket")
		resp, err := svc.GeneratePresignedURL(context.Background(), "test.png", "image/png")

		if err != nil {
			t.Errorf("GeneratePresignedURL() error = %v, want nil", err)
		}
		if resp == nil {
			t.Fatal("GeneratePresignedURL() returned nil")
		}
		if resp.UploadURL != "https://s3.example.com/presigned-put-url" {
			t.Errorf("UploadURL = %v, want https://s3.example.com/presigned-put-url", resp.UploadURL)
		}
		if resp.DownloadURL != "https://s3.example.com/presigned-get-url" {
			t.Errorf("DownloadURL = %v, want https://s3.example.com/presigned-get-url", resp.DownloadURL)
		}
		if resp.Key == "" {
			t.Error("Key is empty")
		}
	})

	t.Run("key format contains uuid and filename", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockClient := awss3.NewMockPresignClient(ctrl)

		var capturedKey string
		mockClient.EXPECT().PresignPutObject(gomock.Any(), gomock.Any(), gomock.Any()).
			DoAndReturn(func(ctx context.Context, params *s3.PutObjectInput, optFns ...func(*s3.PresignOptions)) (*v4.PresignedHTTPRequest, error) {
				capturedKey = *params.Key
				return &v4.PresignedHTTPRequest{URL: "https://s3.example.com/url"}, nil
			})
		mockClient.EXPECT().PresignGetObject(gomock.Any(), gomock.Any(), gomock.Any()).
			Return(&v4.PresignedHTTPRequest{URL: "https://s3.example.com/get-url"}, nil)

		svc := NewService(mockClient, "test-bucket")
		resp, err := svc.GeneratePresignedURL(context.Background(), "photo.jpg", "image/jpeg")

		if err != nil {
			t.Fatalf("GeneratePresignedURL() error = %v", err)
		}
		// Key should end with the filename
		if len(capturedKey) < len("photo.jpg")+1 {
			t.Errorf("Key too short: %v", capturedKey)
		}
		suffix := capturedKey[len(capturedKey)-len("photo.jpg"):]
		if suffix != "photo.jpg" {
			t.Errorf("Key suffix = %v, want photo.jpg", suffix)
		}
		if resp.Key != capturedKey {
			t.Errorf("response Key = %v, want %v", resp.Key, capturedKey)
		}
	})

	t.Run("presign put error", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockClient := awss3.NewMockPresignClient(ctrl)

		mockClient.EXPECT().PresignPutObject(gomock.Any(), gomock.Any(), gomock.Any()).
			Return(nil, errors.New("presign put failed"))

		svc := NewService(mockClient, "test-bucket")
		resp, err := svc.GeneratePresignedURL(context.Background(), "test.png", "image/png")

		if err == nil {
			t.Error("GeneratePresignedURL() error = nil, want error")
		}
		if resp != nil {
			t.Errorf("GeneratePresignedURL() response = %v, want nil", resp)
		}
	})

	t.Run("presign get error", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockClient := awss3.NewMockPresignClient(ctrl)

		mockClient.EXPECT().PresignPutObject(gomock.Any(), gomock.Any(), gomock.Any()).
			Return(&v4.PresignedHTTPRequest{URL: "https://s3.example.com/put-url"}, nil)
		mockClient.EXPECT().PresignGetObject(gomock.Any(), gomock.Any(), gomock.Any()).
			Return(nil, errors.New("presign get failed"))

		svc := NewService(mockClient, "test-bucket")
		resp, err := svc.GeneratePresignedURL(context.Background(), "test.png", "image/png")

		if err == nil {
			t.Error("GeneratePresignedURL() error = nil, want error")
		}
		if resp != nil {
			t.Errorf("GeneratePresignedURL() response = %v, want nil", resp)
		}
	})
}
