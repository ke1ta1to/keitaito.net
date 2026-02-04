package contact

import "context"

//go:generate mockgen -source=service.go -destination=service_mock.go -package=contact

type ServiceInterface interface {
	GetContact(ctx context.Context) (*Contact, error)
	UpdateContact(ctx context.Context, email, x string) (*Contact, error)
}

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetContact(ctx context.Context) (*Contact, error) {
	return s.repo.Get(ctx)
}

func (s *Service) UpdateContact(ctx context.Context, email, x string) (*Contact, error) {
	c := &Contact{
		Email: email,
		X:     x,
	}

	if err := s.repo.Update(ctx, c); err != nil {
		return nil, err
	}

	return c, nil
}
