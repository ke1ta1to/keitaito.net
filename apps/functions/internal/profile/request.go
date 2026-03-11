package profile

import "github.com/go-playground/validator/v10"

var validate = validator.New()

type UpdateRequest struct {
	Name     string `json:"name" validate:"required"`
	Birthday string `json:"birthday" validate:"required"`
	Location string `json:"location" validate:"required"`
	School   string `json:"school" validate:"required"`
	ImageURL string `json:"image_url" validate:"required"`
	Twitter  string `json:"twitter" validate:"required"`
	Github   string `json:"github" validate:"required"`
	Zenn     string `json:"zenn" validate:"required"`
	Qiita    string `json:"qiita" validate:"required"`
}

func (r *UpdateRequest) Validate() error {
	return validate.Struct(r)
}
