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
	"github.com/ke1ta1to/keitaito.net/functions/internal/skills"
	"go.uber.org/mock/gomock"
)

func TestNewListHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := skills.NewMockServiceInterface(ctrl)

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
		mockSvc := skills.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().ListSkills(gomock.Any()).Return([]skills.Skill{}, nil)

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

		var got []skills.Skill
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		if diff := cmp.Diff([]skills.Skill{}, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("success with multiple skills", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := skills.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().ListSkills(gomock.Any()).Return([]skills.Skill{
			{ID: "id-1", Name: "Go", IconURL: "https://example.com/go.png"},
			{ID: "id-2", Name: "TypeScript", IconURL: "https://example.com/ts.png"},
		}, nil)

		h := NewListHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
		if resp.StatusCode != http.StatusOK {
			t.Errorf("Handle() StatusCode = %v, want %v", resp.StatusCode, http.StatusOK)
		}

		var got []skills.Skill
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		want := []skills.Skill{
			{ID: "id-1", Name: "Go", IconURL: "https://example.com/go.png"},
			{ID: "id-2", Name: "TypeScript", IconURL: "https://example.com/ts.png"},
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("service error", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := skills.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().ListSkills(gomock.Any()).Return(nil, errors.New("service error"))

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
