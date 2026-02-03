GOOS := linux
GOARCH := arm64
CGO_ENABLED := 0
DIST_DIR := ../dist/functions

FUNCTIONS := activities_list activities_get activities_create activities_update activities_delete skills_list skills_get skills_create skills_update skills_delete

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
