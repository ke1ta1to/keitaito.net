package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/google/go-cmp/cmp"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/works"
	"go.uber.org/mock/gomock"
)

func TestNewListHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := works.NewMockServiceInterface(ctrl)

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
		mockSvc := works.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().ListWorks(gomock.Any()).Return([]works.Work{}, nil)

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

		var got []works.Work
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		if diff := cmp.Diff([]works.Work{}, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("success with multiple works", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().ListWorks(gomock.Any()).Return([]works.Work{
			{ID: "id-1", Title: "Work 1", Slug: "work-1", Content: "Content 1", Thumbnail: "https://example.com/1.png"},
			{ID: "id-2", Title: "Work 2", Slug: "work-2", Content: "Content 2", Thumbnail: "https://example.com/2.png"},
		}, nil)

		h := NewListHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusOK)
		}

		var got []works.Work
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		want := []works.Work{
			{ID: "id-1", Title: "Work 1", Slug: "work-1", Content: "Content 1", Thumbnail: "https://example.com/1.png"},
			{ID: "id-2", Title: "Work 2", Slug: "work-2", Content: "Content 2", Thumbnail: "https://example.com/2.png"},
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("service error", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().ListWorks(gomock.Any()).Return(nil, errors.New("service error"))

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
