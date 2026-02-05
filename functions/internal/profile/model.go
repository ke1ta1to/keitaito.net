package profile

// API
type Profile struct {
	Name     string `json:"name"`
	Birthday string `json:"birthday"`
	Location string `json:"location"`
	School   string `json:"school"`
	ImageURL string `json:"image_url"`
	X        string `json:"x"`
	GitHub   string `json:"github"`
	Zenn     string `json:"zenn"`
	Qiita    string `json:"qiita"`
}

// DynamoDB
type Record struct {
	PK       string `dynamodbav:"pk"`
	Name     string `dynamodbav:"name"`
	Birthday string `dynamodbav:"birthday"`
	Location string `dynamodbav:"location"`
	School   string `dynamodbav:"school"`
	ImageURL string `dynamodbav:"image_url"`
	X        string `dynamodbav:"x"`
	GitHub   string `dynamodbav:"github"`
	Zenn     string `dynamodbav:"zenn"`
	Qiita    string `dynamodbav:"qiita"`
}
