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
	"github.com/ke1ta1to/keitaito.net/functions/internal/profile"
	"go.uber.org/mock/gomock"
)

func TestNewUpdateHandler(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockSvc := profile.NewMockServiceInterface(ctrl)
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
	validBody := `{"name":"Keita Ito","birthday":"2004-07-09","location":"Tokyo","school":"University of Tokyo","image_url":"https://example.com/image.png","x":"https://x.com/keitaito","github":"https://github.com/keitaito","zenn":"https://zenn.dev/keitaito","qiita":"https://qiita.com/keitaito"}`

	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := profile.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().UpdateProfile(gomock.Any(),
			"Keita Ito", "2004-07-09", "Tokyo", "University of Tokyo",
			"https://example.com/image.png",
			"https://x.com/keitaito", "https://github.com/keitaito",
			"https://zenn.dev/keitaito", "https://qiita.com/keitaito",
		).Return(&profile.Profile{
			Name:     "Keita Ito",
			Birthday: "2004-07-09",
			Location: "Tokyo",
			School:   "University of Tokyo",
			ImageURL: "https://example.com/image.png",
			X:        "https://x.com/keitaito",
			GitHub:   "https://github.com/keitaito",
			Zenn:     "https://zenn.dev/keitaito",
			Qiita:    "https://qiita.com/keitaito",
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

		var got profile.Profile
		if err := json.Unmarshal([]byte(resp.Body), &got); err != nil {
			t.Fatalf("Handle() failed to unmarshal response body: %v", err)
		}
		want := profile.Profile{
			Name:     "Keita Ito",
			Birthday: "2004-07-09",
			Location: "Tokyo",
			School:   "University of Tokyo",
			ImageURL: "https://example.com/image.png",
			X:        "https://x.com/keitaito",
			GitHub:   "https://github.com/keitaito",
			Zenn:     "https://zenn.dev/keitaito",
			Qiita:    "https://qiita.com/keitaito",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("Handle() body mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("invalid JSON", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := profile.NewMockServiceInterface(ctrl)

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

	t.Run("validation error - missing name", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := profile.NewMockServiceInterface(ctrl)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"birthday":"2004-07-09","location":"Tokyo","school":"University of Tokyo","image_url":"https://example.com/image.png","x":"https://x.com/keitaito","github":"https://github.com/keitaito","zenn":"https://zenn.dev/keitaito","qiita":"https://qiita.com/keitaito"}`,
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

	t.Run("validation error - invalid URL", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := profile.NewMockServiceInterface(ctrl)

		h := NewUpdateHandler(mockSvc, validator.New())
		resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
			Body: `{"name":"Keita Ito","birthday":"2004-07-09","location":"Tokyo","school":"University of Tokyo","image_url":"https://example.com/image.png","x":"not-a-url","github":"https://github.com/keitaito","zenn":"https://zenn.dev/keitaito","qiita":"https://qiita.com/keitaito"}`,
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
		mockSvc := profile.NewMockServiceInterface(ctrl)
		mockSvc.EXPECT().UpdateProfile(gomock.Any(),
			"Keita Ito", "2004-07-09", "Tokyo", "University of Tokyo",
			"https://example.com/image.png",
			"https://x.com/keitaito", "https://github.com/keitaito",
			"https://zenn.dev/keitaito", "https://qiita.com/keitaito",
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
