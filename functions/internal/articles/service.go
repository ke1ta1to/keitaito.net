package articles

//go:generate mockgen -source=service.go -destination=service_mock.go -package=articles

import (
	"context"
)

type ServiceInterface interface {
	ListArticles(ctx context.Context) ([]Article, error)
}

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) ListArticles(ctx context.Context) ([]Article, error) {
	return s.repo.Get(ctx)
}
