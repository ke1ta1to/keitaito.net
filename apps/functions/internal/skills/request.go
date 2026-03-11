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

func (r *CreateRequest) ToSkill() Skill {
	return Skill{
		Name:    r.Name,
		IconURL: r.IconURL,
	}
}

type UpdateRequest struct {
	Name    string `json:"name" validate:"required"`
	IconURL string `json:"icon_url" validate:"required"`
}

func (r *UpdateRequest) Validate() error {
	return validate.Struct(r)
}

func (r *UpdateRequest) ToSkill() Skill {
	return Skill{
		Name:    r.Name,
		IconURL: r.IconURL,
	}
}
