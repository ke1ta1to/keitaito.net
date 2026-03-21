GOOS := linux
GOARCH := arm64
CGO_ENABLED := 0
DIST_DIR := ./dist/functions

FUNCTIONS := $(notdir $(wildcard ./cmd/*))

.PHONY: all
all: $(FUNCTIONS)

.PHONY: $(FUNCTIONS)
$(FUNCTIONS):
	GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=$(CGO_ENABLED) \
		go build -o $(DIST_DIR)/$@/bootstrap ./cmd/$@

.PHONY: test
test:
	go test ./...
