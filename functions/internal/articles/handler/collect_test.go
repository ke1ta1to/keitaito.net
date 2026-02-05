package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/ke1ta1to/keitaito.net/functions/internal/articles"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"go.uber.org/mock/gomock"
)

func TestNewCollectHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := articles.NewMockCollectorServiceInterface(ctrl)

	h := NewCollectHandler(mockSvc)

	if h == nil {
		t.Fatal("NewCollectHandler() returned nil")
	}
	if h.svc == nil {
		t.Error("NewCollectHandler() did not set svc")
	}
}

func TestCollectHandler_Handle(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := articles.NewMockCollectorServiceInterface(ctrl)
		mockSvc.EXPECT().Collect(gomock.Any()).Return(nil)

		h := NewCollectHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusNoContent {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusNoContent)
		}
	})

	t.Run("collector error", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := articles.NewMockCollectorServiceInterface(ctrl)
		mockSvc.EXPECT().Collect(gomock.Any()).Return(errors.New("collect error"))

		h := NewCollectHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusInternalServerError {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusInternalServerError)
		}

		var errResp awsapigw.ErrorResponse
		if err := json.Unmarshal([]byte(resp.Body), &errResp); err != nil {
			t.Fatalf("Handle() failed to unmarshal error response: %v", err)
		}
		if errResp.Message != "Internal Server Error" {
			t.Errorf("Handle() error message = %v, want Internal Server Error", errResp.Message)
		}
	})
}
