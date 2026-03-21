package skills

import "github.com/go-playground/validator/v10"

var validate = validator.New()

type CreateRequest struct {
	Name    string `json:"name" validate:"required"`
	IconURL string `json:"icon_url" validate:"required"`
}

func (r *CreateRequest) Validate() error {
	return validate.Struct(r)
}

type UpdateRequest struct {
	Name    string `json:"name" validate:"required"`
	IconURL string `json:"icon_url" validate:"required"`
}

func (r *UpdateRequest) Validate() error {
	return validate.Struct(r)
}

