package articles

import (
	"context"
	"errors"
	"testing"

	"github.com/google/go-cmp/cmp"
	"go.uber.org/mock/gomock"
)

func TestService_ListArticles(t *testing.T) {
	t.Run("success with empty list", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any()).Return([]Article{}, nil)

		svc := NewService(mockRepo)
		got, err := svc.ListArticles(context.Background())

		if err != nil {
			t.Errorf("ListArticles() error = %v, want nil", err)
		}
		if diff := cmp.Diff([]Article{}, got); diff != "" {
			t.Errorf("ListArticles() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("success with multiple articles", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)

		source := "zenn"
		want := []Article{
			{Title: "Article 1", URL: "https://zenn.dev/kk79it/articles/1", LikedCount: 10, PublishedAt: "2025-01-01T00:00:00Z", Source: &source},
			{Title: "Article 2", URL: "https://zenn.dev/kk79it/articles/2", LikedCount: 5, PublishedAt: "2025-01-02T00:00:00Z", Source: &source},
		}
		mockRepo.EXPECT().Get(gomock.Any()).Return(want, nil)

		svc := NewService(mockRepo)
		got, err := svc.ListArticles(context.Background())

		if err != nil {
			t.Errorf("ListArticles() error = %v, want nil", err)
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("ListArticles() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("repository error", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any()).Return(nil, errors.New("repo error"))

		svc := NewService(mockRepo)
		_, err := svc.ListArticles(context.Background())

		if err == nil {
			t.Error("ListArticles() error = nil, want error")
		}
	})
}
