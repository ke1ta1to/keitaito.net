package articles

import "time"

type Article struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	URL         string    `json:"url"`
	LikedCount  int       `json:"liked_count"`
	PublishedAt string    `json:"published_at"`
	Source      *string   `json:"source"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
