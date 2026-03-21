package activities

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"testing"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/mock/gomock"
)

func TestListHandler_Handle(t *testing.T) {
	tests := []struct {
		name       string
		setupMock  func(m *MockRepository)
		wantStatus int
		wantCount  int
		wantOrder  []string // expected ID order
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
		{
			name: "sorted by date desc then createdAt asc",
			setupMock: func(m *MockRepository) {
				m.EXPECT().List(gomock.Any()).Return([]Activity{
					{ID: "1", Title: "oldest date", Date: "2024-01-01", CreatedAt: time.Date(2024, 1, 1, 10, 0, 0, 0, time.UTC)},
					{ID: "2", Title: "newest date", Date: "2024-03-01", CreatedAt: time.Date(2024, 3, 1, 10, 0, 0, 0, time.UTC)},
					{ID: "3", Title: "mid date late", Date: "2024-02-01", CreatedAt: time.Date(2024, 2, 1, 12, 0, 0, 0, time.UTC)},
					{ID: "4", Title: "mid date early", Date: "2024-02-01", CreatedAt: time.Date(2024, 2, 1, 8, 0, 0, 0, time.UTC)},
				}, nil)
			},
			wantStatus: http.StatusOK,
			wantCount:  4,
			wantOrder:  []string{"2", "4", "3", "1"}, // 2024-03-01, 2024-02-01(early), 2024-02-01(late), 2024-01-01
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
				if tt.wantOrder != nil {
					for i, wantID := range tt.wantOrder {
						if items[i].ID != wantID {
							t.Errorf("items[%d].ID = %q, want %q", i, items[i].ID, wantID)
						}
					}
				}
			}
		})
	}
}
