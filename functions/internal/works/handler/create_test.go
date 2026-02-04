package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/go-playground/validator/v10"
	"github.com/google/go-cmp/cmp"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsapigw"
	"github.com/ke1ta1to/keitaito.net/functions/internal/works"
	"go.uber.org/mock/gomock"
)

func TestNewCreateHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := works.NewMockServiceInterface(ctrl)
	validate := validator.New()

	h := NewCreateHandler(mockSvc, validate)

	if h == nil {
		t.Fatal("NewCreateHandler() returned nil")
	}
	if h.svc == nil {
		t.Error("NewCreateHandler() did not set svc")
	}
	if h.validate == nil {
		t.Error("NewCreateHandler() did not set validate")
	}
}

func TestCreateHandler_Handle(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().CreateWork(gomock.Any(), "New Work", "new-work", "New Content", "https://example.com/new.png").Return(&works.Work{
			ID:        "new-id",
			Title:     "New Work",
			Slug:      "new-work",
			Content:   "New Content",
			Thumbnail: "https://example.com/new.png",
		}, nil)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"title":"New Work","slug":"new-work","content":"New Content","thumbnail":"https://example.com/new.png"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusCreated {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusCreated)
		}
		wantHeaders := map[string]string{
			"Content-Type":                "application/json",
			"Access-Control-Allow-Origin": "*",
		}
		if diff := cmp.Diff(wantHeaders, resp.Headers); diff != "" {
			t.Errorf("Handle() headers mismatch (-want +got):\n%s", diff)
		}

		var got works.Work
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		want := works.Work{
			ID:        "new-id",
			Title:     "New Work",
			Slug:      "new-work",
			Content:   "New Content",
			Thumbnail: "https://example.com/new.png",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("invalid JSON", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{invalid json}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusBadRequest {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusBadRequest)
		}

		var errResp awsapigw.ErrorResponse
		if err := json.Unmarshal([]byte(resp.Body), &errResp); err != nil {
			t.Fatalf("Handle() failed to unmarshal error response: %v", err)
		}
		if errResp.Message == "" {
			t.Error("Handle() error response message is empty")
		}
	})

	t.Run("validation error - missing title", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"slug":"test-slug","content":"Content","thumbnail":"https://example.com/thumb.png"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusBadRequest {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusBadRequest)
		}

		var errResp awsapigw.ErrorResponse
		if err := json.Unmarshal([]byte(resp.Body), &errResp); err != nil {
			t.Fatalf("Handle() failed to unmarshal error response: %v", err)
		}
		if errResp.Message == "" {
			t.Error("Handle() error response message is empty")
		}
	})

	t.Run("validation error - missing slug", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"title":"Title","content":"Content","thumbnail":"https://example.com/thumb.png"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusBadRequest {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusBadRequest)
		}

		var errResp awsapigw.ErrorResponse
		if err := json.Unmarshal([]byte(resp.Body), &errResp); err != nil {
			t.Fatalf("Handle() failed to unmarshal error response: %v", err)
		}
		if errResp.Message == "" {
			t.Error("Handle() error response message is empty")
		}
	})

	t.Run("validation error - missing content", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"title":"Title","slug":"test-slug","thumbnail":"https://example.com/thumb.png"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusBadRequest {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusBadRequest)
		}

		var errResp awsapigw.ErrorResponse
		if err := json.Unmarshal([]byte(resp.Body), &errResp); err != nil {
			t.Fatalf("Handle() failed to unmarshal error response: %v", err)
		}
		if errResp.Message == "" {
			t.Error("Handle() error response message is empty")
		}
	})

	t.Run("service error", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().CreateWork(gomock.Any(), "New Work", "new-work", "New Content", "https://example.com/new.png").Return(nil, errors.New("service error"))

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"title":"New Work","slug":"new-work","content":"New Content","thumbnail":"https://example.com/new.png"}`,
		})

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
