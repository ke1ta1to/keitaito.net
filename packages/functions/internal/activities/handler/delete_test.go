package handler

import (
	"context"
	"errors"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/google/go-cmp/cmp"
	"github.com/ke1ta1to/keitaito.net/functions/internal/activities"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
	"go.uber.org/mock/gomock"
)

func TestNewDeleteHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := activities.NewMockServiceInterface(ctrl)

	h := NewDeleteHandler(mockSvc)

	if h == nil {
		t.Fatal("NewDeleteHandler() returned nil")
	}
	if h.svc == nil {
		t.Error("NewDeleteHandler() did not set svc")
	}
}

func TestDeleteHandler_Handle(t *testing.T) {
	t.Run("empty id", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)

		h := NewDeleteHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{},
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
		mockSvc.EXPECT().DeleteActivity(gomock.Any(), "delete-id").Return(nil)

		h := NewDeleteHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "delete-id"},
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusNoContent {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusNoContent)
		}
		wantHeaders := map[string]string{
			"Access-Control-Allow-Origin": "*",
		}
		if diff := cmp.Diff(wantHeaders, resp.Headers); diff != "" {
			t.Errorf("Handle() headers mismatch (-want +got):\n%s", diff)
		}
		if resp.Body != "" {
			t.Errorf("Handle() Body = %v, want empty", resp.Body)
		}
	})

	t.Run("not found", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().DeleteActivity(gomock.Any(), "not-found-id").Return(awsdynamodb.ErrNotFound)

		h := NewDeleteHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "not-found-id"},
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
		mockSvc.EXPECT().DeleteActivity(gomock.Any(), "delete-id").Return(errors.New("service error"))

		h := NewDeleteHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			PathParameters: map[string]string{"id": "delete-id"},
		})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusInternalServerError {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusInternalServerError)
		}
	})
}
