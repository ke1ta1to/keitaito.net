package uploads

type PresignResponse struct {
	UploadURL string `json:"upload_url"`
	Key       string `json:"key"`
}
