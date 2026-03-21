package skills

import "testing"

func TestCreateRequest_Validate(t *testing.T) {
	tests := []struct {
		name    string
		req     CreateRequest
		wantErr bool
	}{
		{
			name:    "valid",
			req:     CreateRequest{Name: "Go", IconURL: "https://example.com/go.svg"},
			wantErr: false,
		},
		{
			name:    "missing name",
			req:     CreateRequest{IconURL: "https://example.com/go.svg"},
			wantErr: true,
		},
		{
			name:    "missing icon_url",
			req:     CreateRequest{Name: "Go"},
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
			req:     UpdateRequest{Name: "Go", IconURL: "https://example.com/go.svg"},
			wantErr: false,
		},
		{
			name:    "missing name",
			req:     UpdateRequest{IconURL: "https://example.com/go.svg"},
			wantErr: true,
		},
		{
			name:    "missing icon_url",
			req:     UpdateRequest{Name: "Go"},
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

