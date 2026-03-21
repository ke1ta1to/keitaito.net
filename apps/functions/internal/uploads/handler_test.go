package uploads

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	"go.uber.org/mock/gomock"
)

func TestHandler_Handle(t *testing.T) {
	const fixedID = "fixed-uuid"

	tests := []struct {
		name       string
		body       string
		setupMock  func(m *MockPresigner)
		wantStatus int
		checkBody  func(t *testing.T, body string)
	}{
		{
			name: "success",
			body: `{"filename":"photo.jpg","content_type":"image/jpeg","content_length":1048576}`,
			setupMock: func(m *MockPresigner) {
				m.EXPECT().PresignPutObject(gomock.Any(), gomock.Any(), gomock.Any()).
					Return(&v4.PresignedHTTPRequest{URL: "https://s3.example.com/presigned"}, nil)
			},
			wantStatus: http.StatusOK,
			checkBody: func(t *testing.T, body string) {
				var r response
				if err := json.Unmarshal([]byte(body), &r); err != nil {
					t.Fatalf("unmarshal: %v", err)
				}
				if r.URL != "https://s3.example.com/presigned" {
					t.Errorf("url = %q", r.URL)
				}
				if r.Key != fixedID+"/photo.jpg" {
					t.Errorf("key = %q, want %q", r.Key, fixedID+"/photo.jpg")
				}
			},
		},
		{
			name:       "invalid json",
			body:       `{invalid`,
			setupMock:  func(m *MockPresigner) {},
			wantStatus: http.StatusBadRequest,
			checkBody: func(t *testing.T, body string) {
				if !strings.Contains(body, "Invalid request body") {
					t.Errorf("body = %q", body)
				}
			},
		},
		{
			name:       "empty filename",
			body:       `{"filename":"","content_type":"image/jpeg","content_length":1048576}`,
			setupMock:  func(m *MockPresigner) {},
			wantStatus: http.StatusBadRequest,
			checkBody: func(t *testing.T, body string) {
				if !strings.Contains(body, "'Filename' failed on the 'required' tag") {
					t.Errorf("body = %q", body)
				}
			},
		},
		{
			name:       "empty content_type",
			body:       `{"filename":"photo.jpg","content_type":"","content_length":1048576}`,
			setupMock:  func(m *MockPresigner) {},
			wantStatus: http.StatusBadRequest,
			checkBody: func(t *testing.T, body string) {
				if !strings.Contains(body, "'ContentType' failed on the 'required' tag") {
					t.Errorf("body = %q", body)
				}
			},
		},
		{
			name:       "zero content_length",
			body:       `{"filename":"photo.jpg","content_type":"image/jpeg","content_length":0}`,
			setupMock:  func(m *MockPresigner) {},
			wantStatus: http.StatusBadRequest,
			checkBody: func(t *testing.T, body string) {
				if !strings.Contains(body, "'ContentLength' failed on the 'required' tag") {
					t.Errorf("body = %q", body)
				}
			},
		},
		{
			name:       "missing content_length",
			body:       `{"filename":"photo.jpg","content_type":"image/jpeg"}`,
			setupMock:  func(m *MockPresigner) {},
			wantStatus: http.StatusBadRequest,
			checkBody: func(t *testing.T, body string) {
				if !strings.Contains(body, "'ContentLength' failed on the 'required' tag") {
					t.Errorf("body = %q", body)
				}
			},
		},
		{
			name:       "content_length exceeds maximum",
			body:       `{"filename":"photo.jpg","content_type":"image/jpeg","content_length":52428801}`,
			setupMock:  func(m *MockPresigner) {},
			wantStatus: http.StatusBadRequest,
			checkBody: func(t *testing.T, body string) {
				if !strings.Contains(body, "'ContentLength' failed on the 'max' tag") {
					t.Errorf("body = %q", body)
				}
			},
		},
		{
			name: "presigner error",
			body: `{"filename":"photo.jpg","content_type":"image/jpeg","content_length":1048576}`,
			setupMock: func(m *MockPresigner) {
				m.EXPECT().PresignPutObject(gomock.Any(), gomock.Any(), gomock.Any()).
					Return(nil, errors.New("presign error"))
			},
			wantStatus: http.StatusInternalServerError,
			checkBody: func(t *testing.T, body string) {
				if !strings.Contains(body, "Failed to generate presigned URL") {
					t.Errorf("body = %q", body)
				}
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			presigner := NewMockPresigner(ctrl)
			tt.setupMock(presigner)

			h := NewHandler(presigner, "test-bucket")
			h.idFunc = func() string { return fixedID }

			resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
				Body: tt.body,
			})
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if resp.StatusCode != tt.wantStatus {
				t.Errorf("status = %d, want %d", resp.StatusCode, tt.wantStatus)
			}
			if tt.checkBody != nil {
				tt.checkBody(t, resp.Body)
			}
		})
	}
}
