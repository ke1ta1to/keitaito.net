package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/google/go-cmp/cmp"
	"github.com/ke1ta1to/keitaito.net/functions/internal/articles"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"go.uber.org/mock/gomock"
)

func TestNewListHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := articles.NewMockServiceInterface(ctrl)

	h := NewListHandler(mockSvc)

	if h == nil {
		t.Fatal("NewListHandler() returned nil")
	}
	if h.svc == nil {
		t.Error("NewListHandler() did not set svc")
	}
}

func TestListHandler_Handle(t *testing.T) {
	t.Run("success with empty list", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := articles.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().ListArticles(gomock.Any()).Return([]articles.Article{}, nil)

		h := NewListHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusOK)
		}
		wantHeaders := map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		}
		if diff := cmp.Diff(wantHeaders, resp.Headers); diff != "" {
			t.Errorf("Handle() headers mismatch (-want +got):\n%s", diff)
		}

		var got []articles.Article
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		if diff := cmp.Diff([]articles.Article{}, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("success with multiple articles", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := articles.NewMockServiceInterface(ctrl)

		source := "zenn"
		mockSvc.EXPECT().ListArticles(gomock.Any()).Return([]articles.Article{
			{Title: "Article 1", URL: "https://zenn.dev/kk79it/articles/1", LikedCount: 10, PublishedAt: "2025-01-01T00:00:00Z", Source: &source},
			{Title: "Article 2", URL: "https://zenn.dev/kk79it/articles/2", LikedCount: 5, PublishedAt: "2025-01-02T00:00:00Z", Source: &source},
		}, nil)

		h := NewListHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusOK)
		}

		var got []articles.Article
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		want := []articles.Article{
			{Title: "Article 1", URL: "https://zenn.dev/kk79it/articles/1", LikedCount: 10, PublishedAt: "2025-01-01T00:00:00Z", Source: &source},
			{Title: "Article 2", URL: "https://zenn.dev/kk79it/articles/2", LikedCount: 5, PublishedAt: "2025-01-02T00:00:00Z", Source: &source},
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("service error", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := articles.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().ListArticles(gomock.Any()).Return(nil, errors.New("service error"))

		h := NewListHandler(mockSvc)
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
