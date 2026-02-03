package skills

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

func TestService_GetSkill(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any(), "test-id").Return(&Skill{
			ID:      "test-id",
			Name:    "Go",
			IconURL: "https://example.com/go.png",
		}, nil)

		svc := NewService(mockRepo)
		got, err := svc.GetSkill(context.Background(), "test-id")

		if err != nil {
			t.Errorf("GetSkill() error = %v, want nil", err)
		}
		want := &Skill{
			ID:      "test-id",
			Name:    "Go",
			IconURL: "https://example.com/go.png",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("GetSkill() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any(), "not-found").Return(nil, awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		got, err := svc.GetSkill(context.Background(), "not-found")

		if err == nil {
			t.Error("GetSkill() expected error, got nil")
		}
		if got != nil {
			t.Errorf("GetSkill() expected nil, got %v", got)
		}
	})
}

func TestService_ListSkills(t *testing.T) {
	t.Run("success with empty list", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().List(gomock.Any()).Return([]Skill{}, nil)

		svc := NewService(mockRepo)
		got, err := svc.ListSkills(context.Background())

		if err != nil {
			t.Errorf("ListSkills() error = %v, want nil", err)
		}
		if diff := cmp.Diff([]Skill{}, got); diff != "" {
			t.Errorf("ListSkills() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("success with multiple skills", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().List(gomock.Any()).Return([]Skill{
			{ID: "id-1", Name: "Go", IconURL: "https://example.com/go.png"},
			{ID: "id-2", Name: "TypeScript", IconURL: "https://example.com/ts.png"},
		}, nil)

		svc := NewService(mockRepo)
		got, err := svc.ListSkills(context.Background())

		if err != nil {
			t.Errorf("ListSkills() error = %v, want nil", err)
		}
		want := []Skill{
			{ID: "id-1", Name: "Go", IconURL: "https://example.com/go.png"},
			{ID: "id-2", Name: "TypeScript", IconURL: "https://example.com/ts.png"},
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("ListSkills() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().List(gomock.Any()).Return(nil, awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		got, err := svc.ListSkills(context.Background())

		if err == nil {
			t.Error("ListSkills() expected error, got nil")
		}
		if got != nil {
			t.Errorf("ListSkills() expected nil, got %v", got)
		}
	})
}

func TestService_CreateSkill(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Create(gomock.Any(), gomock.Any()).DoAndReturn(
			func(ctx context.Context, s *Skill) error {
				if s.ID == "" {
					return errors.New("ID should not be empty")
				}
				if s.Name != "Go" {
					return errors.New("Name mismatch")
				}
				if s.IconURL != "https://example.com/go.png" {
					return errors.New("IconURL mismatch")
				}
				return nil
			})

		svc := NewService(mockRepo)
		got, err := svc.CreateSkill(context.Background(), "Go", "https://example.com/go.png")

		if err != nil {
			t.Errorf("CreateSkill() error = %v, want nil", err)
		}
		if got == nil {
			t.Fatal("CreateSkill() returned nil on success")
		}
		if got.ID == "" {
			t.Error("CreateSkill() ID should be auto-generated")
		}
		if got.Name != "Go" {
			t.Errorf("CreateSkill() Name = %v, want %v", got.Name, "Go")
		}
		if got.IconURL != "https://example.com/go.png" {
			t.Errorf("CreateSkill() IconURL = %v, want %v", got.IconURL, "https://example.com/go.png")
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Create(gomock.Any(), gomock.Any()).Return(errors.New("create failed"))

		svc := NewService(mockRepo)
		got, err := svc.CreateSkill(context.Background(), "Go", "https://example.com/go.png")

		if err == nil {
			t.Error("CreateSkill() expected error, got nil")
		}
		if got != nil {
			t.Errorf("CreateSkill() expected nil on error, got %v", got)
		}
	})
}

func TestService_UpdateSkill(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Update(gomock.Any(), &Skill{
			ID:      "update-id",
			Name:    "Updated Go",
			IconURL: "https://example.com/go-updated.png",
		}).Return(nil)

		svc := NewService(mockRepo)
		got, err := svc.UpdateSkill(context.Background(), "update-id", "Updated Go", "https://example.com/go-updated.png")

		if err != nil {
			t.Errorf("UpdateSkill() error = %v, want nil", err)
		}
		want := &Skill{
			ID:      "update-id",
			Name:    "Updated Go",
			IconURL: "https://example.com/go-updated.png",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("UpdateSkill() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Update(gomock.Any(), gomock.Any()).Return(awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		got, err := svc.UpdateSkill(context.Background(), "update-id", "Updated Go", "https://example.com/go-updated.png")

		if err == nil {
			t.Error("UpdateSkill() expected error, got nil")
		}
		if got != nil {
			t.Errorf("UpdateSkill() expected nil, got %v", got)
		}
	})
}

func TestService_DeleteSkill(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Delete(gomock.Any(), "delete-id").Return(nil)

		svc := NewService(mockRepo)
		err := svc.DeleteSkill(context.Background(), "delete-id")

		if err != nil {
			t.Errorf("DeleteSkill() error = %v, want nil", err)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Delete(gomock.Any(), "delete-id").Return(awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		err := svc.DeleteSkill(context.Background(), "delete-id")

		if err == nil {
			t.Error("DeleteSkill() expected error, got nil")
		}
	})
}
