package articles

//go:generate mockgen -source=collector.go -destination=collector_mock.go -package=articles

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"sort"
)

type HTTPClient interface {
	Do(req *http.Request) (*http.Response, error)
}

type CollectorServiceInterface interface {
	Collect(ctx context.Context) error
}

type CollectorService struct {
	repo       Repository
	httpClient HTTPClient
	zennUser   string
	qiitaUser  string
}

func NewCollectorService(repo Repository, httpClient HTTPClient, zennUser, qiitaUser string) *CollectorService {
	return &CollectorService{
		repo:       repo,
		httpClient: httpClient,
		zennUser:   zennUser,
		qiitaUser:  qiitaUser,
	}
}

func (c *CollectorService) Collect(ctx context.Context) error {
	zennArticles, zennErr := c.fetchZenn(ctx)
	qiitaArticles, qiitaErr := c.fetchQiita(ctx)

	if zennErr != nil && qiitaErr != nil {
		return fmt.Errorf("both APIs failed: zenn: %w, qiita: %v", zennErr, qiitaErr)
	}

	var articles []Article
	articles = append(articles, zennArticles...)
	articles = append(articles, qiitaArticles...)

	sort.Slice(articles, func(i, j int) bool {
		return articles[i].PublishedAt > articles[j].PublishedAt
	})

	if len(articles) > 5 {
		articles = articles[:5]
	}

	return c.repo.Put(ctx, articles)
}

func (c *CollectorService) fetchZenn(ctx context.Context) ([]Article, error) {
	url := fmt.Sprintf("https://zenn.dev/api/articles?username=%s&order=latest", c.zennUser)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("zenn API returned status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var zennResp ZennResponse
	if err := json.Unmarshal(body, &zennResp); err != nil {
		return nil, err
	}

	source := "zenn"
	articles := make([]Article, len(zennResp.Articles))
	for i, a := range zennResp.Articles {
		articles[i] = Article{
			Title:       a.Title,
			URL:         "https://zenn.dev" + a.Path,
			LikedCount:  a.LikedCount,
			PublishedAt: a.PublishedAt,
			Source:      &source,
		}
	}

	return articles, nil
}

func (c *CollectorService) fetchQiita(ctx context.Context) ([]Article, error) {
	url := fmt.Sprintf("https://qiita.com/api/v2/users/%s/items?per_page=5&page=1", c.qiitaUser)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("qiita API returned status %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var qiitaArticles []QiitaArticle
	if err := json.Unmarshal(body, &qiitaArticles); err != nil {
		return nil, err
	}

	source := "qiita"
	articles := make([]Article, len(qiitaArticles))
	for i, a := range qiitaArticles {
		articles[i] = Article{
			Title:       a.Title,
			URL:         a.URL,
			LikedCount:  a.LikesCount,
			PublishedAt: a.CreatedAt,
			Source:      &source,
		}
	}

	return articles, nil
}
