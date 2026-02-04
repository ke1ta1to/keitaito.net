package works

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

func TestService_GetWork(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any(), "test-id").Return(&Work{
			ID:        "test-id",
			Title:     "Test Work",
			Slug:      "test-work",
			Content:   "Test Content",
			Thumbnail: "https://example.com/thumb.png",
		}, nil)

		svc := NewService(mockRepo)
		got, err := svc.GetWork(context.Background(), "test-id")

		if err != nil {
			t.Errorf("GetWork() error = %v, want nil", err)
		}
		want := &Work{
			ID:        "test-id",
			Title:     "Test Work",
			Slug:      "test-work",
			Content:   "Test Content",
			Thumbnail: "https://example.com/thumb.png",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("GetWork() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any(), "not-found").Return(nil, awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		got, err := svc.GetWork(context.Background(), "not-found")

		if err == nil {
			t.Error("GetWork() expected error, got nil")
		}
		if got != nil {
			t.Errorf("GetWork() expected nil, got %v", got)
		}
	})
}

func TestService_ListWorks(t *testing.T) {
	t.Run("success with empty list", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().List(gomock.Any()).Return([]Work{}, nil)

		svc := NewService(mockRepo)
		got, err := svc.ListWorks(context.Background())

		if err != nil {
			t.Errorf("ListWorks() error = %v, want nil", err)
		}
		if diff := cmp.Diff([]Work{}, got); diff != "" {
			t.Errorf("ListWorks() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("success with multiple works", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().List(gomock.Any()).Return([]Work{
			{ID: "id-1", Title: "Work 1", Slug: "work-1", Content: "Content 1", Thumbnail: "https://example.com/1.png"},
			{ID: "id-2", Title: "Work 2", Slug: "work-2", Content: "Content 2", Thumbnail: "https://example.com/2.png"},
		}, nil)

		svc := NewService(mockRepo)
		got, err := svc.ListWorks(context.Background())

		if err != nil {
			t.Errorf("ListWorks() error = %v, want nil", err)
		}
		want := []Work{
			{ID: "id-1", Title: "Work 1", Slug: "work-1", Content: "Content 1", Thumbnail: "https://example.com/1.png"},
			{ID: "id-2", Title: "Work 2", Slug: "work-2", Content: "Content 2", Thumbnail: "https://example.com/2.png"},
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("ListWorks() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().List(gomock.Any()).Return(nil, awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		got, err := svc.ListWorks(context.Background())

		if err == nil {
			t.Error("ListWorks() expected error, got nil")
		}
		if got != nil {
			t.Errorf("ListWorks() expected nil, got %v", got)
		}
	})
}

func TestService_CreateWork(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Create(gomock.Any(), gomock.Any()).DoAndReturn(
			func(ctx context.Context, w *Work) error {
				if w.ID == "" {
					return errors.New("ID should not be empty")
				}
				if w.Title != "New Work" {
					return errors.New("Title mismatch")
				}
				if w.Slug != "new-work" {
					return errors.New("Slug mismatch")
				}
				if w.Content != "New Content" {
					return errors.New("Content mismatch")
				}
				if w.Thumbnail != "https://example.com/new.png" {
					return errors.New("Thumbnail mismatch")
				}
				return nil
			})

		svc := NewService(mockRepo)
		got, err := svc.CreateWork(context.Background(), "New Work", "new-work", "New Content", "https://example.com/new.png")

		if err != nil {
			t.Errorf("CreateWork() error = %v, want nil", err)
		}
		if got == nil {
			t.Fatal("CreateWork() returned nil on success")
		}
		if got.ID == "" {
			t.Error("CreateWork() ID should be auto-generated")
		}
		if got.Title != "New Work" {
			t.Errorf("CreateWork() Title = %v, want %v", got.Title, "New Work")
		}
		if got.Slug != "new-work" {
			t.Errorf("CreateWork() Slug = %v, want %v", got.Slug, "new-work")
		}
		if got.Content != "New Content" {
			t.Errorf("CreateWork() Content = %v, want %v", got.Content, "New Content")
		}
		if got.Thumbnail != "https://example.com/new.png" {
			t.Errorf("CreateWork() Thumbnail = %v, want %v", got.Thumbnail, "https://example.com/new.png")
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Create(gomock.Any(), gomock.Any()).Return(errors.New("create failed"))

		svc := NewService(mockRepo)
		got, err := svc.CreateWork(context.Background(), "New Work", "new-work", "New Content", "https://example.com/new.png")

		if err == nil {
			t.Error("CreateWork() expected error, got nil")
		}
		if got != nil {
			t.Errorf("CreateWork() expected nil on error, got %v", got)
		}
	})
}

func TestService_UpdateWork(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Update(gomock.Any(), &Work{
			ID:        "update-id",
			Title:     "Updated Title",
			Slug:      "updated-title",
			Content:   "Updated Content",
			Thumbnail: "https://example.com/updated.png",
		}).Return(nil)

		svc := NewService(mockRepo)
		got, err := svc.UpdateWork(context.Background(), "update-id", "Updated Title", "updated-title", "Updated Content", "https://example.com/updated.png")

		if err != nil {
			t.Errorf("UpdateWork() error = %v, want nil", err)
		}
		want := &Work{
			ID:        "update-id",
			Title:     "Updated Title",
			Slug:      "updated-title",
			Content:   "Updated Content",
			Thumbnail: "https://example.com/updated.png",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("UpdateWork() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Update(gomock.Any(), gomock.Any()).Return(awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		got, err := svc.UpdateWork(context.Background(), "update-id", "Updated Title", "updated-title", "Updated Content", "https://example.com/updated.png")

		if err == nil {
			t.Error("UpdateWork() expected error, got nil")
		}
		if got != nil {
			t.Errorf("UpdateWork() expected nil, got %v", got)
		}
	})
}

func TestService_DeleteWork(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Delete(gomock.Any(), "delete-id").Return(nil)

		svc := NewService(mockRepo)
		err := svc.DeleteWork(context.Background(), "delete-id")

		if err != nil {
			t.Errorf("DeleteWork() error = %v, want nil", err)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Delete(gomock.Any(), "delete-id").Return(awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		err := svc.DeleteWork(context.Background(), "delete-id")

		if err == nil {
			t.Error("DeleteWork() expected error, got nil")
		}
	})
}
