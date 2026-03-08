package activities

import "testing"

func TestCreateRequest_Validate(t *testing.T) {
	tests := []struct {
		name    string
		req     CreateRequest
		wantErr bool
	}{
		{
			name:    "valid",
			req:     CreateRequest{Title: "t", Date: "2024-01-01", Description: "d"},
			wantErr: false,
		},
		{
			name:    "missing title",
			req:     CreateRequest{Date: "2024-01-01", Description: "d"},
			wantErr: true,
		},
		{
			name:    "missing date",
			req:     CreateRequest{Title: "t", Description: "d"},
			wantErr: true,
		},
		{
			name:    "missing description",
			req:     CreateRequest{Title: "t", Date: "2024-01-01"},
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

func TestCreateRequest_ToActivity(t *testing.T) {
	r := CreateRequest{Title: "t", Date: "2024-01-01", Description: "d"}
	a := r.ToActivity()
	if a.Title != "t" || a.Date != "2024-01-01" || a.Description != "d" {
		t.Errorf("ToActivity() = %+v", a)
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
			req:     UpdateRequest{Title: "t", Date: "2024-01-01", Description: "d"},
			wantErr: false,
		},
		{
			name:    "missing title",
			req:     UpdateRequest{Date: "2024-01-01", Description: "d"},
			wantErr: true,
		},
		{
			name:    "missing date",
			req:     UpdateRequest{Title: "t", Description: "d"},
			wantErr: true,
		},
		{
			name:    "missing description",
			req:     UpdateRequest{Title: "t", Date: "2024-01-01"},
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

func TestUpdateRequest_ToActivity(t *testing.T) {
	r := UpdateRequest{Title: "t", Date: "2024-01-01", Description: "d"}
	a := r.ToActivity()
	if a.Title != "t" || a.Date != "2024-01-01" || a.Description != "d" {
		t.Errorf("ToActivity() = %+v", a)
	}
}
