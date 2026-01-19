GOOS := linux
GOARCH := arm64
CGO_ENABLED := 0
DIST_DIR := ../../dist/functions

FUNCTIONS := get-activities get-activity create-activity

.PHONY: all clean $(FUNCTIONS)

all: $(FUNCTIONS)

$(FUNCTIONS):
	GOOS=$(GOOS) GOARCH=$(GOARCH) CGO_ENABLED=$(CGO_ENABLED) \
		go build -o $(DIST_DIR)/$@/bootstrap ./cmd/$@

clean:
	rm -rf $(DIST_DIR)
