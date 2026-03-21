package works

import "testing"

func TestCreateRequest_Validate(t *testing.T) {
	tests := []struct {
		name    string
		req     CreateRequest
		wantErr bool
	}{
		{
			name:    "valid",
			req:     CreateRequest{Title: "t", Slug: "s", Content: "c"},
			wantErr: false,
		},
		{
			name:    "missing title",
			req:     CreateRequest{Slug: "s", Content: "c"},
			wantErr: true,
		},
		{
			name:    "missing slug",
			req:     CreateRequest{Title: "t", Content: "c"},
			wantErr: true,
		},
		{
			name:    "missing content",
			req:     CreateRequest{Title: "t", Slug: "s"},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.req.Validate()
			if (err != nil) != tt.wantErr {
				t.Errorf("Validate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestUpdateRequest_Validate(t *testing.T) {
	tests := []struct {
		name    string
		req     UpdateRequest
		wantErr bool
	}{
		{
			name:    "valid",
			req:     UpdateRequest{Title: "t", Slug: "s", Content: "c"},
			wantErr: false,
		},
		{
			name:    "missing title",
			req:     UpdateRequest{Slug: "s", Content: "c"},
			wantErr: true,
		},
		{
			name:    "missing slug",
			req:     UpdateRequest{Title: "t", Content: "c"},
			wantErr: true,
		},
		{
			name:    "missing content",
			req:     UpdateRequest{Title: "t", Slug: "s"},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.req.Validate()
			if (err != nil) != tt.wantErr {
				t.Errorf("Validate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
