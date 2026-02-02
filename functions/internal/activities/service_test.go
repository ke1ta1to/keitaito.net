package activities

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

func TestService_GetActivity(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any(), "test-id").Return(&Activity{
			ID:          "test-id",
			Title:       "Test Activity",
			Date:        "2024-01-01",
			Description: "Test Description",
		}, nil)

		svc := NewService(mockRepo)
		got, err := svc.GetActivity(context.Background(), "test-id")

		if err != nil {
			t.Errorf("GetActivity() error = %v, want nil", err)
		}
		want := &Activity{
			ID:          "test-id",
			Title:       "Test Activity",
			Date:        "2024-01-01",
			Description: "Test Description",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("GetActivity() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any(), "not-found").Return(nil, awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		got, err := svc.GetActivity(context.Background(), "not-found")

		if err == nil {
			t.Error("GetActivity() expected error, got nil")
		}
		if got != nil {
			t.Errorf("GetActivity() expected nil, got %v", got)
		}
	})
}

func TestService_ListActivities(t *testing.T) {
	t.Run("success with empty list", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().List(gomock.Any()).Return([]Activity{}, nil)

		svc := NewService(mockRepo)
		got, err := svc.ListActivities(context.Background())

		if err != nil {
			t.Errorf("ListActivities() error = %v, want nil", err)
		}
		if diff := cmp.Diff([]Activity{}, got); diff != "" {
			t.Errorf("ListActivities() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("success with multiple activities", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().List(gomock.Any()).Return([]Activity{
			{ID: "id-1", Title: "Activity 1", Date: "2024-01-01", Description: "Desc 1"},
			{ID: "id-2", Title: "Activity 2", Date: "2024-01-02", Description: "Desc 2"},
		}, nil)

		svc := NewService(mockRepo)
		got, err := svc.ListActivities(context.Background())

		if err != nil {
			t.Errorf("ListActivities() error = %v, want nil", err)
		}
		want := []Activity{
			{ID: "id-1", Title: "Activity 1", Date: "2024-01-01", Description: "Desc 1"},
			{ID: "id-2", Title: "Activity 2", Date: "2024-01-02", Description: "Desc 2"},
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("ListActivities() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().List(gomock.Any()).Return(nil, awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		got, err := svc.ListActivities(context.Background())

		if err == nil {
			t.Error("ListActivities() expected error, got nil")
		}
		if got != nil {
			t.Errorf("ListActivities() expected nil, got %v", got)
		}
	})
}

func TestService_CreateActivity(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Create(gomock.Any(), gomock.Any()).DoAndReturn(
			func(ctx context.Context, a *Activity) error {
				if a.ID == "" {
					return errors.New("ID should not be empty")
				}
				if a.Title != "New Activity" {
					return errors.New("Title mismatch")
				}
				if a.Date != "2024-01-01" {
					return errors.New("Date mismatch")
				}
				if a.Description != "New Description" {
					return errors.New("Description mismatch")
				}
				return nil
			})

		svc := NewService(mockRepo)
		got, err := svc.CreateActivity(context.Background(), "New Activity", "2024-01-01", "New Description")

		if err != nil {
			t.Errorf("CreateActivity() error = %v, want nil", err)
		}
		if got == nil {
			t.Fatal("CreateActivity() returned nil on success")
		}
		if got.ID == "" {
			t.Error("CreateActivity() ID should be auto-generated")
		}
		if got.Title != "New Activity" {
			t.Errorf("CreateActivity() Title = %v, want %v", got.Title, "New Activity")
		}
		if got.Date != "2024-01-01" {
			t.Errorf("CreateActivity() Date = %v, want %v", got.Date, "2024-01-01")
		}
		if got.Description != "New Description" {
			t.Errorf("CreateActivity() Description = %v, want %v", got.Description, "New Description")
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Create(gomock.Any(), gomock.Any()).Return(errors.New("create failed"))

		svc := NewService(mockRepo)
		got, err := svc.CreateActivity(context.Background(), "New Activity", "2024-01-01", "New Description")

		if err == nil {
			t.Error("CreateActivity() expected error, got nil")
		}
		if got != nil {
			t.Errorf("CreateActivity() expected nil on error, got %v", got)
		}
	})
}

func TestService_UpdateActivity(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Update(gomock.Any(), &Activity{
			ID:          "update-id",
			Title:       "Updated Title",
			Date:        "2024-02-01",
			Description: "Updated Description",
		}).Return(nil)

		svc := NewService(mockRepo)
		got, err := svc.UpdateActivity(context.Background(), "update-id", "Updated Title", "2024-02-01", "Updated Description")

		if err != nil {
			t.Errorf("UpdateActivity() error = %v, want nil", err)
		}
		want := &Activity{
			ID:          "update-id",
			Title:       "Updated Title",
			Date:        "2024-02-01",
			Description: "Updated Description",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("UpdateActivity() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Update(gomock.Any(), gomock.Any()).Return(awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		got, err := svc.UpdateActivity(context.Background(), "update-id", "Updated Title", "2024-02-01", "Updated Description")

		if err == nil {
			t.Error("UpdateActivity() expected error, got nil")
		}
		if got != nil {
			t.Errorf("UpdateActivity() expected nil, got %v", got)
		}
	})
}

func TestService_DeleteActivity(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Delete(gomock.Any(), "delete-id").Return(nil)

		svc := NewService(mockRepo)
		err := svc.DeleteActivity(context.Background(), "delete-id")

		if err != nil {
			t.Errorf("DeleteActivity() error = %v, want nil", err)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Delete(gomock.Any(), "delete-id").Return(awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		err := svc.DeleteActivity(context.Background(), "delete-id")

		if err == nil {
			t.Error("DeleteActivity() expected error, got nil")
		}
	})
}
