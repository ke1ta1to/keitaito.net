package articles

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/google/go-cmp/cmp"
	"go.uber.org/mock/gomock"
)

type mockHTTPClient struct {
	doFunc func(req *http.Request) (*http.Response, error)
}

func (m *mockHTTPClient) Do(req *http.Request) (*http.Response, error) {
	return m.doFunc(req)
}

func makeResponse(statusCode int, body any) *http.Response {
	b, _ := json.Marshal(body)
	return &http.Response{
		StatusCode: statusCode,
		Body:       io.NopCloser(bytes.NewReader(b)),
	}
}

func TestCollectorService_Collect(t *testing.T) {
	t.Run("both APIs succeed", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)

		zennResp := ZennResponse{
			Articles: []ZennArticle{
				{Title: "Zenn 1", Path: "/kk79it/articles/z1", LikedCount: 10, PublishedAt: "2025-06-01T00:00:00+09:00"},
				{Title: "Zenn 2", Path: "/kk79it/articles/z2", LikedCount: 5, PublishedAt: "2025-05-01T00:00:00+09:00"},
				{Title: "Zenn 3", Path: "/team411/articles/z3", LikedCount: 3, PublishedAt: "2025-04-01T00:00:00+09:00"},
			},
		}
		qiitaResp := []QiitaArticle{
			{Title: "Qiita 1", URL: "https://qiita.com/ke1ta1to/items/q1", LikesCount: 8, CreatedAt: "2025-05-15T00:00:00+09:00"},
			{Title: "Qiita 2", URL: "https://qiita.com/ke1ta1to/items/q2", LikesCount: 2, CreatedAt: "2025-04-15T00:00:00+09:00"},
			{Title: "Qiita 3", URL: "https://qiita.com/ke1ta1to/items/q3", LikesCount: 1, CreatedAt: "2025-03-01T00:00:00+09:00"},
		}

		httpClient := &mockHTTPClient{
			doFunc: func(req *http.Request) (*http.Response, error) {
				if req.URL.Host == "zenn.dev" {
					return makeResponse(http.StatusOK, zennResp), nil
				}
				return makeResponse(http.StatusOK, qiitaResp), nil
			},
		}

		zenn := "zenn"
		qiita := "qiita"
		var captured []Article
		mockRepo.EXPECT().Put(gomock.Any(), gomock.Any()).DoAndReturn(func(ctx context.Context, articles []Article) error {
			captured = articles
			return nil
		})

		svc := NewCollectorService(mockRepo, httpClient, "kk79it", "ke1ta1to")
		err := svc.Collect(context.Background())

		if err != nil {
			t.Fatalf("Collect() error = %v, want nil", err)
		}

		if len(captured) != 5 {
			t.Fatalf("Collect() saved %d articles, want 5", len(captured))
		}

		// Verify sorted by published_at descending and trimmed to 5
		want := []Article{
			{Title: "Zenn 1", URL: "https://zenn.dev/kk79it/articles/z1", LikedCount: 10, PublishedAt: "2025-06-01T00:00:00+09:00", Source: &zenn},
			{Title: "Qiita 1", URL: "https://qiita.com/ke1ta1to/items/q1", LikedCount: 8, PublishedAt: "2025-05-15T00:00:00+09:00", Source: &qiita},
			{Title: "Zenn 2", URL: "https://zenn.dev/kk79it/articles/z2", LikedCount: 5, PublishedAt: "2025-05-01T00:00:00+09:00", Source: &zenn},
			{Title: "Qiita 2", URL: "https://qiita.com/ke1ta1to/items/q2", LikedCount: 2, PublishedAt: "2025-04-15T00:00:00+09:00", Source: &qiita},
			{Title: "Zenn 3", URL: "https://zenn.dev/team411/articles/z3", LikedCount: 3, PublishedAt: "2025-04-01T00:00:00+09:00", Source: &zenn},
		}
		if diff := cmp.Diff(want, captured); diff != "" {
			t.Errorf("Collect() saved articles mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("zenn fails, qiita succeeds", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)

		qiitaResp := []QiitaArticle{
			{Title: "Qiita 1", URL: "https://qiita.com/ke1ta1to/items/q1", LikesCount: 8, CreatedAt: "2025-05-15T00:00:00+09:00"},
		}

		httpClient := &mockHTTPClient{
			doFunc: func(req *http.Request) (*http.Response, error) {
				if req.URL.Host == "zenn.dev" {
					return makeResponse(http.StatusInternalServerError, nil), nil
				}
				return makeResponse(http.StatusOK, qiitaResp), nil
			},
		}

		qiita := "qiita"
		var captured []Article
		mockRepo.EXPECT().Put(gomock.Any(), gomock.Any()).DoAndReturn(func(ctx context.Context, articles []Article) error {
			captured = articles
			return nil
		})

		svc := NewCollectorService(mockRepo, httpClient, "kk79it", "ke1ta1to")
		err := svc.Collect(context.Background())

		if err != nil {
			t.Fatalf("Collect() error = %v, want nil", err)
		}

		want := []Article{
			{Title: "Qiita 1", URL: "https://qiita.com/ke1ta1to/items/q1", LikedCount: 8, PublishedAt: "2025-05-15T00:00:00+09:00", Source: &qiita},
		}
		if diff := cmp.Diff(want, captured); diff != "" {
			t.Errorf("Collect() saved articles mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("zenn succeeds, qiita fails", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)

		zennResp := ZennResponse{
			Articles: []ZennArticle{
				{Title: "Zenn 1", Path: "/kk79it/articles/z1", LikedCount: 10, PublishedAt: "2025-06-01T00:00:00+09:00"},
			},
		}

		httpClient := &mockHTTPClient{
			doFunc: func(req *http.Request) (*http.Response, error) {
				if req.URL.Host == "zenn.dev" {
					return makeResponse(http.StatusOK, zennResp), nil
				}
				return makeResponse(http.StatusInternalServerError, nil), nil
			},
		}

		zenn := "zenn"
		var captured []Article
		mockRepo.EXPECT().Put(gomock.Any(), gomock.Any()).DoAndReturn(func(ctx context.Context, articles []Article) error {
			captured = articles
			return nil
		})

		svc := NewCollectorService(mockRepo, httpClient, "kk79it", "ke1ta1to")
		err := svc.Collect(context.Background())

		if err != nil {
			t.Fatalf("Collect() error = %v, want nil", err)
		}

		want := []Article{
			{Title: "Zenn 1", URL: "https://zenn.dev/kk79it/articles/z1", LikedCount: 10, PublishedAt: "2025-06-01T00:00:00+09:00", Source: &zenn},
		}
		if diff := cmp.Diff(want, captured); diff != "" {
			t.Errorf("Collect() saved articles mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("both APIs fail", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)

		httpClient := &mockHTTPClient{
			doFunc: func(req *http.Request) (*http.Response, error) {
				return makeResponse(http.StatusInternalServerError, nil), nil
			},
		}

		svc := NewCollectorService(mockRepo, httpClient, "kk79it", "ke1ta1to")
		err := svc.Collect(context.Background())

		if err == nil {
			t.Error("Collect() error = nil, want error")
		}
	})
}
