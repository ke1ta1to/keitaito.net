package contact

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
	validBody := `{"email":"test@example.com","twitter":"@test"}`

	tests := []struct {
		name       string
		body       string
		setupMock  func(m *MockRepository)
		wantStatus int
		checkBody  func(t *testing.T, body string)
	}{
		{
			name: "success",
			body: validBody,
			setupMock: func(m *MockRepository) {
				m.EXPECT().Put(gomock.Any(), gomock.Any()).Return(nil)
			},
			wantStatus: http.StatusOK,
			checkBody: func(t *testing.T, body string) {
				var c Contact
				if err := json.Unmarshal([]byte(body), &c); err != nil {
					t.Fatalf("unmarshal: %v", err)
				}
				if c.Email != "test@example.com" {
					t.Errorf("email = %q, want %q", c.Email, "test@example.com")
				}
			},
		},
		{
			name:       "invalid json",
			body:       `{invalid`,
			setupMock:  func(m *MockRepository) {},
			wantStatus: http.StatusBadRequest,
		},
		{
			name:       "validation error",
			body:       `{"email":""}`,
			setupMock:  func(m *MockRepository) {},
			wantStatus: http.StatusBadRequest,
			checkBody: func(t *testing.T, body string) {
				if !strings.Contains(body, "required") {
					t.Errorf("body = %q, want containing 'required'", body)
				}
			},
		},
		{
			name: "db error",
			body: validBody,
			setupMock: func(m *MockRepository) {
				m.EXPECT().Put(gomock.Any(), gomock.Any()).Return(errors.New("db error"))
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
