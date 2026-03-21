package skills

import "time"

type Skill struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	IconURL   string    `json:"icon_url"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
