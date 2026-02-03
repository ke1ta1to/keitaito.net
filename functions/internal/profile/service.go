package profile

import "context"

//go:generate mockgen -source=service.go -destination=service_mock.go -package=profile

type ServiceInterface interface {
	GetProfile(ctx context.Context) (*Profile, error)
	UpdateProfile(ctx context.Context, name, birthday, location, school, imageURL, x, github, zenn, qiita string) (*Profile, error)
}

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetProfile(ctx context.Context) (*Profile, error) {
	return s.repo.Get(ctx)
}

func (s *Service) UpdateProfile(ctx context.Context, name, birthday, location, school, imageURL, x, github, zenn, qiita string) (*Profile, error) {
	p := &Profile{
		Name:     name,
		Birthday: birthday,
		Location: location,
		School:   school,
		ImageURL: imageURL,
		X:        x,
		GitHub:   github,
		Zenn:     zenn,
		Qiita:    qiita,
	}

	if err := s.repo.Update(ctx, p); err != nil {
		return nil, err
	}

	return p, nil
}
