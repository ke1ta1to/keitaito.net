package skills

import (
	"context"

	"github.com/google/uuid"
)

//go:generate mockgen -source=service.go -destination=service_mock.go -package=skills

type ServiceInterface interface {
	GetSkill(ctx context.Context, id string) (*Skill, error)
	ListSkills(ctx context.Context) ([]Skill, error)
	CreateSkill(ctx context.Context, name, iconURL string) (*Skill, error)
	UpdateSkill(ctx context.Context, id, name, iconURL string) (*Skill, error)
	DeleteSkill(ctx context.Context, id string) error
}

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetSkill(ctx context.Context, id string) (*Skill, error) {
	return s.repo.Get(ctx, id)
}

func (s *Service) ListSkills(ctx context.Context) ([]Skill, error) {
	return s.repo.List(ctx)
}

func (s *Service) CreateSkill(ctx context.Context, name, iconURL string) (*Skill, error) {
	sk := &Skill{
		ID:      uuid.New().String(),
		Name:    name,
		IconURL: iconURL,
	}

	if err := s.repo.Create(ctx, sk); err != nil {
		return nil, err
	}

	return sk, nil
}

func (s *Service) UpdateSkill(ctx context.Context, id, name, iconURL string) (*Skill, error) {
	sk := &Skill{
		ID:      id,
		Name:    name,
		IconURL: iconURL,
	}

	if err := s.repo.Update(ctx, sk); err != nil {
		return nil, err
	}

	return sk, nil
}

func (s *Service) DeleteSkill(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}
