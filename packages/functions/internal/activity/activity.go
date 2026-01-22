package activity

// Activity はAPIレスポンス用のstruct
type Activity struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Date        string `json:"date"`
	Description string `json:"description"`
}

// Item はDynamoDB用のstruct
type Item struct {
	PK          string `dynamodbav:"pk"`
	SK          string `dynamodbav:"sk"`
	Title       string `dynamodbav:"title"`
	Date        string `dynamodbav:"date"`
	Description string `dynamodbav:"description"`
}
