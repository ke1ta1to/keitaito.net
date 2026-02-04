GOOS := linux
GOARCH := arm64
CGO_ENABLED := 0
DIST_DIR := ../dist/functions

FUNCTIONS := $(notdir $(wildcard cmd/*))

.PHONY: all
all: $(FUNCTIONS)

.PHONY: $(FUNCTIONS)
$(FUNCTIONS):
	GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=$(CGO_ENABLED) \
		go build -o $(DIST_DIR)/$@/bootstrap ./cmd/$@

.PHONY: clean
clean:
	rm -rf $(DIST_DIR)

.PHONY: generate
generate:
	go generate ./...

.PHONY: test
test:
	go test -v ./...
