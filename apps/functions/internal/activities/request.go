package activities

import "github.com/go-playground/validator/v10"

var validate = validator.New()

type CreateRequest struct {
	Title       string `json:"title" validate:"required"`
	Date        string `json:"date" validate:"required,datetime=2006-01"`
	Description string `json:"description" validate:"required"`
}

func (r *CreateRequest) Validate() error {
	return validate.Struct(r)
}

func (r *CreateRequest) ToActivity() Activity {
	return Activity{
		Title:       r.Title,
		Date:        r.Date,
		Description: r.Description,
	}
}

type UpdateRequest struct {
	Title       string `json:"title" validate:"required"`
	Date        string `json:"date" validate:"required,datetime=2006-01"`
	Description string `json:"description" validate:"required"`
}

func (r *UpdateRequest) Validate() error {
	return validate.Struct(r)
}

func (r *UpdateRequest) ToActivity() Activity {
	return Activity{
		Title:       r.Title,
		Date:        r.Date,
		Description: r.Description,
	}
}
