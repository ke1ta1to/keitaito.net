GOOS := linux
GOARCH := arm64
CGO_ENABLED := 0
DIST_DIR := ../../dist/functions

FUNCTIONS := get-activities get-activity create-activity update-activity delete-activity

.PHONY: all clean $(FUNCTIONS) generate test

all: $(FUNCTIONS)

$(FUNCTIONS):
	GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=$(CGO_ENABLED) \
		go build -o $(DIST_DIR)/$@/bootstrap ./cmd/$@

clean:
	rm -rf $(DIST_DIR)

generate:
	go generate ./...

test:
	go test -v ./...
