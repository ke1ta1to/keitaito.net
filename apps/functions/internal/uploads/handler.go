package uploads

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/aws/aws-lambda-go/events"
	v4 "github.com/aws/aws-sdk-go-v2/aws/signer/v4"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
	"github.com/ke1ta1to/keitaito.net/apps/functions/internal/apiutil"
)

//go:generate mockgen -typed -destination=presigner_mock_test.go -package=uploads . Presigner

type Presigner interface {
	PresignPutObject(ctx context.Context, params *s3.PutObjectInput, optFns ...func(*s3.PresignOptions)) (*v4.PresignedHTTPRequest, error)
}

type Handler struct {
	presigner Presigner
	bucket    string
	idFunc    func() string
}

func NewHandler(presigner Presigner, bucket string) *Handler {
	return &Handler{presigner: presigner, bucket: bucket, idFunc: uuid.NewString}
}

type response struct {
	URL string `json:"url"`
	Key string `json:"key"`
}

func (h *Handler) Handle(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var r request
	if err := json.Unmarshal([]byte(req.Body), &r); err != nil {
		return apiutil.ErrorResponse(http.StatusBadRequest, "Invalid request body")
	}
	if err := r.Validate(); err != nil {
		return apiutil.ErrorResponse(http.StatusBadRequest, err.Error())
	}

	key := fmt.Sprintf("%s/%s", h.idFunc(), r.Filename)

	presigned, err := h.presigner.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket:        &h.bucket,
		Key:           &key,
		ContentType:   &r.ContentType,
		ContentLength: &r.ContentLength,
	}, func(opts *s3.PresignOptions) {
		opts.Expires = 15 * time.Minute
	})
	if err != nil {
		return apiutil.ErrorResponse(http.StatusInternalServerError, "Failed to generate presigned URL")
	}

	return apiutil.JSONResponse(http.StatusOK, response{
		URL: presigned.URL,
		Key: key,
	})
}
