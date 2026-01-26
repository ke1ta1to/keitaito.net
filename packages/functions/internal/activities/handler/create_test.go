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
	"github.com/ke1ta1to/keitaito.net/functions/internal/activities"
	"go.uber.org/mock/gomock"
)

func TestNewCreateHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := activities.NewMockServiceInterface(ctrl)
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
		mockSvc := activities.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().CreateActivity(gomock.Any(), "New Activity", "2024-01-01", "New Description").Return(&activities.Activity{
			ID:          "new-id",
			Title:       "New Activity",
			Date:        "2024-01-01",
			Description: "New Description",
		}, nil)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"title":"New Activity","date":"2024-01-01","description":"New Description"}`,
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

		var got activities.Activity
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		want := activities.Activity{
			ID:          "new-id",
			Title:       "New Activity",
			Date:        "2024-01-01",
			Description: "New Description",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("invalid JSON", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)

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
	})

	t.Run("validation error - missing title", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"date":"2024-01-01","description":"Description"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusBadRequest {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusBadRequest)
		}
	})

	t.Run("validation error - missing date", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"title":"Title","description":"Description"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusBadRequest {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusBadRequest)
		}
	})

	t.Run("validation error - missing description", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"title":"Title","date":"2024-01-01"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusBadRequest {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusBadRequest)
		}
	})

	t.Run("service error", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().CreateActivity(gomock.Any(), "New Activity", "2024-01-01", "New Description").Return(nil, errors.New("service error"))

		h := NewCreateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"title":"New Activity","date":"2024-01-01","description":"New Description"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusInternalServerError {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusInternalServerError)
		}
	})
}
