package profile

import "time"

type Profile struct {
	Name      string    `json:"name"`
	Birthday  string    `json:"birthday"`
	Location  string    `json:"location"`
	School    string    `json:"school"`
	ImageURL  string    `json:"image_url"`
	Twitter   string    `json:"twitter"`
	Github    string    `json:"github"`
	Zenn      string    `json:"zenn"`
	Qiita     string    `json:"qiita"`
	UpdatedAt time.Time `json:"updated_at"`
}
