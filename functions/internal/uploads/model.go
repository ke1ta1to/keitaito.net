package uploads

type PresignResponse struct {
	UploadURL   string `json:"upload_url"`
	DownloadURL string `json:"download_url"`
	Key         string `json:"key"`
}
