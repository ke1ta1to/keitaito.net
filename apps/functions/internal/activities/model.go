package activities

type Activity struct {
	ID          string `json:"id" dynamodbav:"id"`
	Title       string `json:"title" dynamodbav:"title"`
	Date        string `json:"date" dynamodbav:"date"`
	Description string `json:"description" dynamodbav:"description"`
}
