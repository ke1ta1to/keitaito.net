package activities

import "context"

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetActivity(ctx context.Context, id string) (*Activity, error) {
	return s.repo.Get(ctx, id)
}
