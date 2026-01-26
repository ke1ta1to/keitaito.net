package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"github.com/google/go-cmp/cmp"
	"github.com/ke1ta1to/keitaito.net/functions/internal/activities"
	"go.uber.org/mock/gomock"
)

func TestNewListHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := activities.NewMockServiceInterface(ctrl)

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
		mockSvc := activities.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().ListActivities(gomock.Any()).Return([]activities.Activity{}, nil)

		h := NewListHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})

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

		var got []activities.Activity
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		if diff := cmp.Diff([]activities.Activity{}, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("success with multiple activities", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().ListActivities(gomock.Any()).Return([]activities.Activity{
			{ID: "id-1", Title: "Activity 1", Date: "2024-01-01", Description: "Desc 1"},
			{ID: "id-2", Title: "Activity 2", Date: "2024-01-02", Description: "Desc 2"},
		}, nil)

		h := NewListHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusOK)
		}

		var got []activities.Activity
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		want := []activities.Activity{
			{ID: "id-1", Title: "Activity 1", Date: "2024-01-01", Description: "Desc 1"},
			{ID: "id-2", Title: "Activity 2", Date: "2024-01-02", Description: "Desc 2"},
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("service error", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := activities.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().ListActivities(gomock.Any()).Return(nil, errors.New("service error"))

		h := NewListHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusInternalServerError {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusInternalServerError)
		}
	})
}
