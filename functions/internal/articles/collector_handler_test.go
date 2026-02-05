package articles

import (
	"context"
	"errors"
	"testing"

	"github.com/aws/aws-lambda-go/events"
	"go.uber.org/mock/gomock"
)

func TestCollectorHandler_Handle(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := NewMockCollectorServiceInterface(ctrl)
		mockSvc.EXPECT().Collect(gomock.Any()).Return(nil)

		h := NewCollectorHandler(mockSvc)
		err := h.Handle(context.Background(), events.CloudWatchEvent{})

		if err != nil {
			t.Errorf("Handle() error = %v, want nil", err)
		}
	})

	t.Run("error propagation", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockSvc := NewMockCollectorServiceInterface(ctrl)
		mockSvc.EXPECT().Collect(gomock.Any()).Return(errors.New("collect error"))

		h := NewCollectorHandler(mockSvc)
		err := h.Handle(context.Background(), events.CloudWatchEvent{})

		if err == nil {
			t.Error("Handle() error = nil, want error")
		}
	})
}
