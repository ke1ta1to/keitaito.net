package activities

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/mock/gomock"
)

func TestListHandler_Handle(t *testing.T) {
	tests := []struct {
		name       string
		setupMock  func(m *MockRepository)
		wantStatus int
		wantCount  int
	}{
		{
			name: "success",
			setupMock: func(m *MockRepository) {
				m.EXPECT().List(gomock.Any()).Return([]Activity{
					{ID: "1", Title: "a"},
					{ID: "2", Title: "b"},
				}, nil)
			},
			wantStatus: http.StatusOK,
			wantCount:  2,
		},
		{
			name: "empty list",
			setupMock: func(m *MockRepository) {
				m.EXPECT().List(gomock.Any()).Return([]Activity{}, nil)
			},
			wantStatus: http.StatusOK,
			wantCount:  0,
		},
		{
			name: "db error",
			setupMock: func(m *MockRepository) {
				m.EXPECT().List(gomock.Any()).Return(nil, errors.New("db error"))
			},
			wantStatus: http.StatusInternalServerError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctrl := gomock.NewController(t)
			repo := NewMockRepository(ctrl)
			tt.setupMock(repo)

			h := NewListHandler(repo)
			resp, err := h.Handle(context.Background(), events.APIGatewayProxyRequest{})
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if resp.StatusCode != tt.wantStatus {
				t.Errorf("status = %d, want %d", resp.StatusCode, tt.wantStatus)
			}
			if tt.wantStatus == http.StatusOK {
				var items []Activity
				if err := json.Unmarshal([]byte(resp.Body), &items); err != nil {
					t.Fatalf("unmarshal body: %v", err)
				}
				if len(items) != tt.wantCount {
					t.Errorf("count = %d, want %d", len(items), tt.wantCount)
				}
			}
		})
	}
}
