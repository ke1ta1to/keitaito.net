package activities

// API
type Activity struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Date        string `json:"date"`
	Description string `json:"description"`
}

// DynamoDB
type Record struct {
	PK          string `dynamodbav:"pk"`
	Title       string `dynamodbav:"title"`
	Date        string `dynamodbav:"date"`
	Description string `dynamodbav:"description"`
}
