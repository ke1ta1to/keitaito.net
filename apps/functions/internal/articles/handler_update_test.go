package articles

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/mock/gomock"
)

func TestUpdateHandler_Handle(t *testing.T) {
	tests := []struct {
		name       string
		pathParams map[string]string
		body       string
		setupMock  func(m *MockRepository)
		wantStatus int
		checkBody  func(t *testing.T, body string)
	}{
		{
			name:       "success",
			pathParams: map[string]string{"id": "abc"},
			body:       `{"title":"t","url":"https://example.com","published_at":"2024-01-01"}`,
			setupMock: func(m *MockRepository) {
				m.EXPECT().Update(gomock.Any(), gomock.Any()).Return(nil)
			},
			wantStatus: http.StatusOK,
			checkBody: func(t *testing.T, body string) {
				var a Article
				if err := json.Unmarshal([]byte(body), &a); err != nil {
					t.Fatalf("unmarshal: %v", err)
				}
				if a.ID != "abc" {
					t.Errorf("id = %q, want %q", a.ID, "abc")
				}
			},
		},
		{
			name:       "missing id",
			pathParams: map[string]string{},
			body:       `{"title":"t","url":"https://example.com","published_at":"2024-01-01"}`,
			setupMock:  func(m *MockRepository) {},
			wantStatus: http.StatusBadRequest,
			checkBody: func(t *testing.T, body string) {
				if !strings.Contains(body, "Missing id") {
					t.Errorf("body = %q", body)
				}
			},
		},
		{
			name:       "invalid json",
			pathParams: map[string]string{"id": "abc"},
			body:       `{invalid`,
			setupMock:  func(m *MockRepository) {},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "validation error",
			pathParams: map[string]string{"id": "abc"},
			body:       `{"title":""}`,
			setupMock:  func(m *MockRepository) {},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "not found",
			pathParams: map[string]string{"id": "abc"},
			body:       `{"title":"t","url":"https://example.com","published_at":"2024-01-01"}`,
			setupMock: func(m *MockRepository) {
				m.EXPECT().Update(gomock.Any(), gomock.Any()).Return(ErrNotFound)
			},
			wantStatus: http.StatusNotFound,
		},
		{
			name:       "db error",
			pathParams: map[string]string{"id": "abc"},
			body:       `{"title":"t","url":"https://example.com","published_at":"2024-01-01"}`,
			setupMock: func(m *MockRepository) {
				m.EXPECT().Update(gomock.Any(), gomock.Any()).Return(errors.New("db error"))
			},
			wantStatus: http.StatusInternalServerError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			repo := NewMockRepository(ctrl)
			tt.setupMock(repo)

			h := NewUpdateHandler(repo)
			resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
				PathParameters: tt.pathParams,
				Body:           tt.body,
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
