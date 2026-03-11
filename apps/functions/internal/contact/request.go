package contact

import "github.com/go-playground/validator/v10"

var validate = validator.New()

type UpdateRequest struct {
	Email   string `json:"email" validate:"required"`
	Twitter string `json:"twitter" validate:"required"`
}

func (r *UpdateRequest) Validate() error {
	return validate.Struct(r)
}
