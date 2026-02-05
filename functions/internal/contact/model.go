package contact

// API
type Contact struct {
	Email string `json:"email"`
	X     string `json:"x"`
}

// DynamoDB
type Record struct {
	PK    string `dynamodbav:"pk"`
	Email string `dynamodbav:"email"`
	X     string `dynamodbav:"x"`
}
