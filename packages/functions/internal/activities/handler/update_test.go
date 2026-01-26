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
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
	"go.uber.org/mock/gomock"
)

func TestNewUpdateHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := activities.NewMockServiceInterface(ctrl)
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
		mockSvc := activities.NewMockServiceInterface(ctrl)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{},
			Body:           `{"title":"Title","date":"2024-01-01","description":"Description"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusBadRequest {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusBadRequest)
		}
	})

	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().UpdateActivity(gomock.Any(), "update-id", "Updated Title", "2024-02-01", "Updated Description").Return(&activities.Activity{
			ID:          "update-id",
			Title:       "Updated Title",
			Date:        "2024-02-01",
			Description: "Updated Description",
		}, nil)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "update-id"},
			Body:           `{"title":"Updated Title","date":"2024-02-01","description":"Updated Description"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusOK)
		}
		if resp.Headers["Content-Type"] != "application/json" {
			t.Errorf("Handle() Content-Type = %v, want application/json", resp.Headers["Content-Type"])
		}
		if resp.Headers["Access-Control-Allow-Origin"] != "*" {
			t.Errorf("Handle() Access-Control-Allow-Origin = %v, want *", resp.Headers["Access-Control-Allow-Origin"])
		}

		var got activities.Activity
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		want := activities.Activity{
			ID:          "update-id",
			Title:       "Updated Title",
			Date:        "2024-02-01",
			Description: "Updated Description",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("invalid JSON", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)

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
	})

	t.Run("validation error - missing title", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "update-id"},
			Body:           `{"date":"2024-01-01","description":"Description"}`,
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

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "update-id"},
			Body:           `{"title":"Title","description":"Description"}`,
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

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "update-id"},
			Body:           `{"title":"Title","date":"2024-01-01"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusBadRequest {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusBadRequest)
		}
	})

	t.Run("not found", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().UpdateActivity(gomock.Any(), "not-found-id", "Title", "2024-01-01", "Description").Return(nil, awsdynamodb.ErrNotFound)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "not-found-id"},
			Body:           `{"title":"Title","date":"2024-01-01","description":"Description"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusNotFound {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusNotFound)
		}
	})

	t.Run("service error", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().UpdateActivity(gomock.Any(), "update-id", "Title", "2024-01-01", "Description").Return(nil, errors.New("service error"))

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "update-id"},
			Body:           `{"title":"Title","date":"2024-01-01","description":"Description"}`,
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusInternalServerError {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusInternalServerError)
		}
	})
}
