package contact

import "time"

type Contact struct {
	Email     string    `json:"email"`
	Twitter   string    `json:"twitter"`
	UpdatedAt time.Time `json:"updated_at"`
}
