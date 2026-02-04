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
	"github.com/ke1ta1to/keitaito.net/functions/internal/contact"
	"go.uber.org/mock/gomock"
)

func TestNewUpdateHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := contact.NewMockServiceInterface(ctrl)
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
	validBody := `{"email":"johndoe@example.com","x":"johndoe"}`

	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := contact.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().UpdateContact(gomock.Any(),
			"johndoe@example.com", "johndoe",
		).Return(&contact.Contact{
			Email: "johndoe@example.com",
			X:     "johndoe",
		}, nil)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: validBody,
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

	t.Run("invalid JSON", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := contact.NewMockServiceInterface(ctrl)

		h := NewUpdateHandler(mockSvc, validator.New())
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

	t.Run("validation error - invalid email", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := contact.NewMockServiceInterface(ctrl)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"email":"not-an-email","x":"johndoe"}`,
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

	t.Run("validation error - missing x", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := contact.NewMockServiceInterface(ctrl)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"email":"johndoe@example.com"}`,
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
		mockSvc := contact.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().UpdateContact(gomock.Any(),
			"johndoe@example.com", "johndoe",
		).Return(nil, errors.New("service error"))

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: validBody,
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
