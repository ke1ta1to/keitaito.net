package articles

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
)

type CollectorHandler struct {
	svc CollectorServiceInterface
}

func NewCollectorHandler(svc CollectorServiceInterface) *CollectorHandler {
	return &CollectorHandler{svc: svc}
}

func (h *CollectorHandler) Handle(ctx context.Context, event events.CloudWatchEvent) error {
	return h.svc.Collect(ctx)
}
