package contact

import (
	"context"
	"errors"
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/ke1ta1to/keitaito.net/functions/internal/awsdynamodb"
	"go.uber.org/mock/gomock"
)

func TestNewService(t *testing.T) {
	ctrl := gomock.NewController(t)
	mockRepo := NewMockRepository(ctrl)

	svc := NewService(mockRepo)

	if svc == nil {
		t.Fatal("NewService() returned nil")
	}
	if svc.repo == nil {
		t.Error("NewService() did not set repo")
	}
}

func TestService_GetContact(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any()).Return(&Contact{
			Email: "johndoe@example.com",
			X:     "johndoe",
		}, nil)

		svc := NewService(mockRepo)
		got, err := svc.GetContact(context.Background())

		if err != nil {
			t.Errorf("GetContact() error = %v, want nil", err)
		}
		want := &Contact{
			Email: "johndoe@example.com",
			X:     "johndoe",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("GetContact() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("not found", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any()).Return(nil, awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		got, err := svc.GetContact(context.Background())

		if err == nil {
			t.Error("GetContact() expected error, got nil")
		}
		if got != nil {
			t.Errorf("GetContact() expected nil, got %v", got)
		}
	})
}

func TestService_UpdateContact(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Update(gomock.Any(), &Contact{
			Email: "johndoe@example.com",
			X:     "johndoe",
		}).Return(nil)

		svc := NewService(mockRepo)
		got, err := svc.UpdateContact(context.Background(), "johndoe@example.com", "johndoe")

		if err != nil {
			t.Errorf("UpdateContact() error = %v, want nil", err)
		}
		want := &Contact{
			Email: "johndoe@example.com",
			X:     "johndoe",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("UpdateContact() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Update(gomock.Any(), gomock.Any()).Return(errors.New("update failed"))

		svc := NewService(mockRepo)
		got, err := svc.UpdateContact(context.Background(), "johndoe@example.com", "johndoe")

		if err == nil {
			t.Error("UpdateContact() expected error, got nil")
		}
		if got != nil {
			t.Errorf("UpdateContact() expected nil on error, got %v", got)
		}
	})
}
