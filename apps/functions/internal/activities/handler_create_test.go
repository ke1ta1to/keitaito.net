package activities

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

func TestCreateHandler_Handle(t *testing.T) {
	const fixedID = "fixed-uuid"

	tests := []struct {
		name       string
		body       string
		setupMock  func(m *MockRepository)
		wantStatus int
		checkBody  func(t *testing.T, body string)
	}{
		{
			name: "success",
			body: `{"title":"t","date":"2024-01","description":"d"}`,
			setupMock: func(m *MockRepository) {
				m.EXPECT().Create(gomock.Any(), gomock.Any()).Return(nil)
			},
			wantStatus: http.StatusCreated,
			checkBody: func(t *testing.T, body string) {
				var a Activity
				if err := json.Unmarshal([]byte(body), &a); err != nil {
					t.Fatalf("unmarshal: %v", err)
				}
				if a.ID != fixedID {
					t.Errorf("id = %q, want %q", a.ID, fixedID)
				}
				if a.Title != "t" {
					t.Errorf("title = %q, want %q", a.Title, "t")
				}
			},
		},
		{
			name:       "invalid json",
			body:       `{invalid`,
			setupMock:  func(m *MockRepository) {},
			wantStatus: http.StatusBadRequest,
			checkBody: func(t *testing.T, body string) {
				if !strings.Contains(body, "invalid request body") {
					t.Errorf("body = %q", body)
				}
			},
		},
		{
			name:       "validation error",
			body:       `{"title":""}`,
			setupMock:  func(m *MockRepository) {},
			wantStatus: http.StatusBadRequest,
		},
		{
			name: "db error",
			body: `{"title":"t","date":"2024-01","description":"d"}`,
			setupMock: func(m *MockRepository) {
				m.EXPECT().Create(gomock.Any(), gomock.Any()).Return(errors.New("db error"))
			},
			wantStatus: http.StatusInternalServerError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			repo := NewMockRepository(ctrl)
			tt.setupMock(repo)

			h := NewCreateHandler(repo)
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
