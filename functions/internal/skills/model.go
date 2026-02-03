package skills

// API
type Skill struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	IconURL string `json:"icon_url"`
}

// DynamoDB
type Record struct {
	PK      string `dynamodbav:"pk"`
	SK      string `dynamodbav:"sk"`
	Name    string `dynamodbav:"name"`
	IconURL string `dynamodbav:"icon_url"`
}
