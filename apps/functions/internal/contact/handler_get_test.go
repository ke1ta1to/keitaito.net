package contact

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/mock/gomock"
)

func TestGetHandler_Handle(t *testing.T) {
	tests := []struct {
		name       string
		setupMock  func(m *MockRepository)
		wantStatus int
		checkBody  func(t *testing.T, body string)
	}{
		{
			name: "success",
			setupMock: func(m *MockRepository) {
				m.EXPECT().Get(gomock.Any()).Return(&Contact{Email: "test@example.com", Twitter: "@test"}, nil)
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
			name: "not found",
			setupMock: func(m *MockRepository) {
				m.EXPECT().Get(gomock.Any()).Return(nil, ErrNotFound)
			},
			wantStatus: http.StatusNotFound,
		},
		{
			name: "db error",
			setupMock: func(m *MockRepository) {
				m.EXPECT().Get(gomock.Any()).Return(nil, errors.New("db error"))
			},
			wantStatus: http.StatusInternalServerError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			repo := NewMockRepository(ctrl)
			tt.setupMock(repo)

			h := NewGetHandler(repo)
			resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})
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
