package works

import "github.com/go-playground/validator/v10"

var validate = validator.New()

type CreateRequest struct {
	Title        string  `json:"title" validate:"required"`
	Slug         string  `json:"slug" validate:"required"`
	Content      string  `json:"content" validate:"required"`
	ThumbnailURL *string `json:"thumbnail_url"`
}

func (r *CreateRequest) Validate() error {
	return validate.Struct(r)
}

type UpdateRequest struct {
	Title        string  `json:"title" validate:"required"`
	Slug         string  `json:"slug" validate:"required"`
	Content      string  `json:"content" validate:"required"`
	ThumbnailURL *string `json:"thumbnail_url"`
}

func (r *UpdateRequest) Validate() error {
	return validate.Struct(r)
}
