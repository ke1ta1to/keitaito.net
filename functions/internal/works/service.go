package works

import (
	"context"

	"github.com/google/uuid"
)

//go:generate mockgen -source=service.go -destination=service_mock.go -package=works

type ServiceInterface interface {
	GetWork(ctx context.Context, id string) (*Work, error)
	ListWorks(ctx context.Context) ([]Work, error)
	CreateWork(ctx context.Context, title, slug, content, thumbnail string) (*Work, error)
	UpdateWork(ctx context.Context, id, title, slug, content, thumbnail string) (*Work, error)
	DeleteWork(ctx context.Context, id string) error
}

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetWork(ctx context.Context, id string) (*Work, error) {
	return s.repo.Get(ctx, id)
}

func (s *Service) ListWorks(ctx context.Context) ([]Work, error) {
	return s.repo.List(ctx)
}

func (s *Service) CreateWork(ctx context.Context, title, slug, content, thumbnail string) (*Work, error) {
	w := &Work{
		ID:        uuid.New().String(),
		Title:     title,
		Slug:      slug,
		Content:   content,
		Thumbnail: thumbnail,
	}

	if err := s.repo.Create(ctx, w); err != nil {
		return nil, err
	}

	return w, nil
}

func (s *Service) UpdateWork(ctx context.Context, id, title, slug, content, thumbnail string) (*Work, error) {
	w := &Work{
		ID:        id,
		Title:     title,
		Slug:      slug,
		Content:   content,
		Thumbnail: thumbnail,
	}

	if err := s.repo.Update(ctx, w); err != nil {
		return nil, err
	}

	return w, nil
}

func (s *Service) DeleteWork(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
