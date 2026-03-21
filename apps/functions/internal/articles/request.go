package articles

import "github.com/go-playground/validator/v10"

var validate = validator.New()

type CreateRequest struct {
	Title       string  `json:"title" validate:"required"`
	URL         string  `json:"url" validate:"required"`
	LikedCount  int     `json:"liked_count"`
	PublishedAt string  `json:"published_at" validate:"required"`
	Source      *string `json:"source"`
}

func (r *CreateRequest) Validate() error {
	return validate.Struct(r)
}

type UpdateRequest struct {
	Title       string  `json:"title" validate:"required"`
	URL         string  `json:"url" validate:"required"`
	LikedCount  int     `json:"liked_count"`
	PublishedAt string  `json:"published_at" validate:"required"`
	Source      *string `json:"source"`
}

func (r *UpdateRequest) Validate() error {
	return validate.Struct(r)
}
