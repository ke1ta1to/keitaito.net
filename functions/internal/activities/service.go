package activities

import (
	"context"

	"github.com/google/uuid"
)

//go:generate mockgen -source=service.go -destination=service_mock.go -package=activities

type ServiceInterface interface {
	GetActivity(ctx context.Context, id string) (*Activity, error)
	ListActivities(ctx context.Context) ([]Activity, error)
	CreateActivity(ctx context.Context, title, date, description string) (*Activity, error)
	UpdateActivity(ctx context.Context, id, title, date, description string) (*Activity, error)
	DeleteActivity(ctx context.Context, id string) error
}

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetActivity(ctx context.Context, id string) (*Activity, error) {
	return s.repo.Get(ctx, id)
}

func (s *Service) ListActivities(ctx context.Context) ([]Activity, error) {
	return s.repo.List(ctx)
}

func (s *Service) CreateActivity(ctx context.Context, title, date, description string) (*Activity, error) {
	a := &Activity{
		ID:          uuid.New().String(),
		Title:       title,
		Date:        date,
		Description: description,
	}

	if err := s.repo.Create(ctx, a); err != nil {
		return nil, err
	}

	return a, nil
}

func (s *Service) UpdateActivity(ctx context.Context, id, title, date, description string) (*Activity, error) {
	a := &Activity{
		ID:          id,
		Title:       title,
		Date:        date,
		Description: description,
	}

	if err := s.repo.Update(ctx, a); err != nil {
		return nil, err
	}

	return a, nil
}

func (s *Service) DeleteActivity(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
