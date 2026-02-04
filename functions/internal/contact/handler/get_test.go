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
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
	"github.com/ke1ta1to/keitaito.net/functions/internal/contact"
	"go.uber.org/mock/gomock"
)

func TestNewGetHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := contact.NewMockServiceInterface(ctrl)

	h := NewGetHandler(mockSvc)

	if h == nil {
		t.Fatal("NewGetHandler() returned nil")
	}
	if h.svc == nil {
		t.Error("NewGetHandler() did not set svc")
	}
}

func TestGetHandler_Handle(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := contact.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().GetContact(gomock.Any()).Return(&contact.Contact{
			Email: "johndoe@example.com",
			X:     "johndoe",
		}, nil)

		h := NewGetHandler(mockSvc)
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

		var got contact.Contact
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		want := contact.Contact{
			Email: "johndoe@example.com",
			X:     "johndoe",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("not found", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := contact.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().GetContact(gomock.Any()).Return(nil, awsdynamodb.ErrNotFound)

		h := NewGetHandler(mockSvc)
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})

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
		mockSvc := contact.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().GetContact(gomock.Any()).Return(nil, errors.New("service error"))

		h := NewGetHandler(mockSvc)
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
