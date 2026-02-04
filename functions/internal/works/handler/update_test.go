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
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
	"github.com/ke1ta1to/keitaito.net/functions/internal/works"
	"go.uber.org/mock/gomock"
)

func TestNewUpdateHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := works.NewMockServiceInterface(ctrl)
	validate := validator.New()

	h := NewUpdateHandler(mockSvc, validate)

	if h == nil {
		t.Fatal("NewUpdateHandler() returned nil")
	}
	if h.svc == nil {
		t.Error("NewUpdateHandler() did not set svc")
	}
	if h.validate == nil {
		t.Error("NewUpdateHandler() did not set validate")
	}
}

func TestUpdateHandler_Handle(t *testing.T) {
	t.Run("empty id", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{},
			Body:           `{"title":"Title","slug":"title","content":"Content","thumbnail":"https://example.com/thumb.png"}`,
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

	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().UpdateWork(gomock.Any(), "update-id", "Updated Title", "updated-title", "Updated Content", "https://example.com/updated.png").Return(&works.Work{
			ID:        "update-id",
			Title:     "Updated Title",
			Slug:      "updated-title",
			Content:   "Updated Content",
			Thumbnail: "https://example.com/updated.png",
		}, nil)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "update-id"},
			Body:           `{"title":"Updated Title","slug":"updated-title","content":"Updated Content","thumbnail":"https://example.com/updated.png"}`,
		})

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

		var got works.Work
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		want := works.Work{
			ID:        "update-id",
			Title:     "Updated Title",
			Slug:      "updated-title",
			Content:   "Updated Content",
			Thumbnail: "https://example.com/updated.png",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("invalid JSON", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "update-id"},
			Body:           `{invalid json}`,
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

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "update-id"},
			Body:           `{"slug":"test-slug","content":"Content","thumbnail":"https://example.com/thumb.png"}`,
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

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "update-id"},
			Body:           `{"title":"Title","content":"Content","thumbnail":"https://example.com/thumb.png"}`,
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

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "update-id"},
			Body:           `{"title":"Title","slug":"test-slug","thumbnail":"https://example.com/thumb.png"}`,
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

	t.Run("not found", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := works.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().UpdateWork(gomock.Any(), "not-found-id", "Title", "title", "Content", "https://example.com/thumb.png").Return(nil, awsdynamodb.ErrNotFound)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "not-found-id"},
			Body:           `{"title":"Title","slug":"title","content":"Content","thumbnail":"https://example.com/thumb.png"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusNotFound {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusNotFound)
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
		mockSvc.EXPECT().UpdateWork(gomock.Any(), "update-id", "Title", "title", "Content", "https://example.com/thumb.png").Return(nil, errors.New("service error"))

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "update-id"},
			Body:           `{"title":"Title","slug":"title","content":"Content","thumbnail":"https://example.com/thumb.png"}`,
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
