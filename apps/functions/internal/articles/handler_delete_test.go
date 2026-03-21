package articles

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/mock/gomock"
)

func TestDeleteHandler_Handle(t *testing.T) {
	tests := []struct {
		name       string
		pathParams map[string]string
		setupMock  func(m *MockRepository)
		wantStatus int
		checkBody  func(t *testing.T, body string)
	}{
		{
			name:       "success",
			pathParams: map[string]string{"id": "abc"},
			setupMock: func(m *MockRepository) {
				m.EXPECT().Delete(gomock.Any(), "abc").Return(nil)
			},
			wantStatus: http.StatusNoContent,
		},
		{
			name:       "missing id",
			pathParams: map[string]string{},
			setupMock:  func(m *MockRepository) {},
			wantStatus: http.StatusBadRequest,
			checkBody: func(t *testing.T, body string) {
				if !strings.Contains(body, "Missing id") {
					t.Errorf("body = %q", body)
				}
			},
		},
		{
			name:       "not found",
			pathParams: map[string]string{"id": "abc"},
			setupMock: func(m *MockRepository) {
				m.EXPECT().Delete(gomock.Any(), "abc").Return(ErrNotFound)
			},
			wantStatus: http.StatusNotFound,
		},
		{
			name:       "db error",
			pathParams: map[string]string{"id": "abc"},
			setupMock: func(m *MockRepository) {
				m.EXPECT().Delete(gomock.Any(), "abc").Return(errors.New("db error"))
			},
			wantStatus: http.StatusInternalServerError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			repo := NewMockRepository(ctrl)
			tt.setupMock(repo)

			h := NewDeleteHandler(repo)
			resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{
				PathParameters: tt.pathParams,
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
