package uploads

import "github.com/go-playground/validator/v10"

var validate = validator.New()

type request struct {
	Filename      string `json:"filename" validate:"required"`
	ContentType   string `json:"content_type" validate:"required"`
	ContentLength int64  `json:"content_length" validate:"required,gt=0,max=52428800"`
}

func (r *request) Validate() error {
	return validate.Struct(r)
}
