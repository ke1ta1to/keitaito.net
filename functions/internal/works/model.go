package works

// API
type Work struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Slug      string `json:"slug"`
	Content   string `json:"content"`
	Thumbnail string `json:"thumbnail"`
}

// DynamoDB
type Record struct {
	PK        string `dynamodbav:"pk"`
	SK        string `dynamodbav:"sk"`
	Title     string `dynamodbav:"title"`
	Slug      string `dynamodbav:"slug"`
	Content   string `dynamodbav:"content"`
	Thumbnail string `dynamodbav:"thumbnail"`
}
