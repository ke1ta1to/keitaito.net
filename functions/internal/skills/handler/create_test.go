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
	"github.com/ke1ta1to/keitaito.net/functions/internal/skills"
	"go.uber.org/mock/gomock"
)

func TestNewCreateHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := skills.NewMockServiceInterface(ctrl)
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
		mockSvc := skills.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().CreateSkill(gomock.Any(), "Go", "https://example.com/go.png").Return(&skills.Skill{
			ID:      "new-id",
			Name:    "Go",
			IconURL: "https://example.com/go.png",
		}, nil)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"name":"Go","icon_url":"https://example.com/go.png"}`,
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

		var got skills.Skill
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		want := skills.Skill{
			ID:      "new-id",
			Name:    "Go",
			IconURL: "https://example.com/go.png",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("invalid JSON", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := skills.NewMockServiceInterface(ctrl)

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

	t.Run("validation error - missing name", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := skills.NewMockServiceInterface(ctrl)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"icon_url":"https://example.com/go.png"}`,
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

	t.Run("validation error - missing icon_url", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := skills.NewMockServiceInterface(ctrl)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"name":"Go"}`,
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
		mockSvc := skills.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().CreateSkill(gomock.Any(), "Go", "https://example.com/go.png").Return(nil, errors.New("service error"))

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"name":"Go","icon_url":"https://example.com/go.png"}`,
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
