package profile

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

func TestService_GetProfile(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any()).Return(&Profile{
			Name:     "Keita Ito",
			Birthday: "2004-07-09",
			Location: "Tokyo",
			School:   "University of Tokyo",
			ImageURL: "https://example.com/image.png",
			X:        "https://x.com/keitaito",
			GitHub:   "https://github.com/keitaito",
			Zenn:     "https://zenn.dev/keitaito",
			Qiita:    "https://qiita.com/keitaito",
		}, nil)

		svc := NewService(mockRepo)
		got, err := svc.GetProfile(context.Background())

		if err != nil {
			t.Errorf("GetProfile() error = %v, want nil", err)
		}
		want := &Profile{
			Name:     "Keita Ito",
			Birthday: "2004-07-09",
			Location: "Tokyo",
			School:   "University of Tokyo",
			ImageURL: "https://example.com/image.png",
			X:        "https://x.com/keitaito",
			GitHub:   "https://github.com/keitaito",
			Zenn:     "https://zenn.dev/keitaito",
			Qiita:    "https://qiita.com/keitaito",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("GetProfile() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("not found", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Get(gomock.Any()).Return(nil, awsdynamodb.ErrNotFound)

		svc := NewService(mockRepo)
		got, err := svc.GetProfile(context.Background())

		if err == nil {
			t.Error("GetProfile() expected error, got nil")
		}
		if got != nil {
			t.Errorf("GetProfile() expected nil, got %v", got)
		}
	})
}

func TestService_UpdateProfile(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Update(gomock.Any(), &Profile{
			Name:     "Keita Ito",
			Birthday: "2004-07-09",
			Location: "Tokyo",
			School:   "University of Tokyo",
			ImageURL: "https://example.com/image.png",
			X:        "https://x.com/keitaito",
			GitHub:   "https://github.com/keitaito",
			Zenn:     "https://zenn.dev/keitaito",
			Qiita:    "https://qiita.com/keitaito",
		}).Return(nil)

		svc := NewService(mockRepo)
		got, err := svc.UpdateProfile(context.Background(),
			"Keita Ito", "2004-07-09", "Tokyo", "University of Tokyo",
			"https://example.com/image.png",
			"https://x.com/keitaito", "https://github.com/keitaito",
			"https://zenn.dev/keitaito", "https://qiita.com/keitaito",
		)

		if err != nil {
			t.Errorf("UpdateProfile() error = %v, want nil", err)
		}
		want := &Profile{
			Name:     "Keita Ito",
			Birthday: "2004-07-09",
			Location: "Tokyo",
			School:   "University of Tokyo",
			ImageURL: "https://example.com/image.png",
			X:        "https://x.com/keitaito",
			GitHub:   "https://github.com/keitaito",
			Zenn:     "https://zenn.dev/keitaito",
			Qiita:    "https://qiita.com/keitaito",
		}
		if diff := cmp.Diff(want, got); diff != "" {
			t.Errorf("UpdateProfile() mismatch (-want +got):\n%s", diff)
		}
	})

	t.Run("error from repository", func(t *testing.T) {
		ctrl := gomock.NewController(t)
		mockRepo := NewMockRepository(ctrl)
		mockRepo.EXPECT().Update(gomock.Any(), gomock.Any()).Return(errors.New("update failed"))

		svc := NewService(mockRepo)
		got, err := svc.UpdateProfile(context.Background(),
			"Keita Ito", "2004-07-09", "Tokyo", "University of Tokyo",
			"https://example.com/image.png",
			"https://x.com/keitaito", "https://github.com/keitaito",
			"https://zenn.dev/keitaito", "https://qiita.com/keitaito",
		)

		if err == nil {
			t.Error("UpdateProfile() expected error, got nil")
		}
		if got != nil {
			t.Errorf("UpdateProfile() expected nil on error, got %v", got)
		}
	})
}
