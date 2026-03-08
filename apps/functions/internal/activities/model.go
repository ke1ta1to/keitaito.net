package activities

import "time"

type Activity struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Date        string    `json:"date"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
