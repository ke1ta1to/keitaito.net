package articles

// Article is the API response model.
type Article struct {
	Title       string  `json:"title"`
	URL         string  `json:"url"`
	LikedCount  int     `json:"liked_count"`
	PublishedAt string  `json:"published_at"`
	Source      *string `json:"source"`
}

// Record is the DynamoDB record for cached articles.
type Record struct {
	PK        string          `dynamodbav:"pk"`
	Items     []ArticleRecord `dynamodbav:"items"`
	UpdatedAt string          `dynamodbav:"updatedAt"`
}

// ArticleRecord is a single article stored in DynamoDB.
type ArticleRecord struct {
	Title       string  `dynamodbav:"title"`
	URL         string  `dynamodbav:"url"`
	LikedCount  int     `dynamodbav:"liked_count"`
	PublishedAt string  `dynamodbav:"published_at"`
	Source      *string `dynamodbav:"source"`
}

// ZennResponse is the response from Zenn API.
type ZennResponse struct {
	Articles []ZennArticle `json:"articles"`
}

// ZennArticle is a single article from Zenn API.
type ZennArticle struct {
	Title       string `json:"title"`
	Path        string `json:"path"`
	LikedCount  int    `json:"liked_count"`
	PublishedAt string `json:"published_at"`
}

// QiitaArticle is a single article from Qiita API.
type QiitaArticle struct {
	Title      string `json:"title"`
	URL        string `json:"url"`
	LikesCount int    `json:"likes_count"`
	CreatedAt  string `json:"created_at"`
}
