# Build configuration
VERSION ?= main
IMG ?= apecloud/kubeblocks-docs
BUILDX_NAME = kubeblocks-docs-xbuilder

# Tool configurations
YARN := yarn
DOCKER := docker
PLATFORMS := linux/arm64,linux/amd64

# Help target
.PHONY: help
help: ## Show help information
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: all
all: docker-build ## Default target: build Docker image

# Build targets
.PHONY: build
build: ## Build source code
	@echo "Building source code..."
	$(YARN) build

# Docker targets
.PHONY: docker-buildx-setup
docker-buildx-setup: ## Setup docker buildx
	@if ! $(DOCKER) buildx ls | grep -q "$(BUILDX_NAME)"; then \
		$(DOCKER) buildx create --name $(BUILDX_NAME) --use; \
	fi
	$(DOCKER) buildx use $(BUILDX_NAME)
	$(DOCKER) buildx inspect

.PHONY: docker-build
docker-build: build docker-buildx-setup ## Build and push Docker image
	$(DOCKER) buildx build \
		--platform=$(PLATFORMS) \
		-f Dockerfile \
		--push \
		-t $(IMG):$(VERSION) .
	$(DOCKER) buildx rm $(BUILDX_NAME)

# sync kbcli docs, call scripts/sync-kbcli-docs.sh
BRANCH ?= main
.PHONY: sync-kbcli-docs
sync-kbcli-docs: ## Sync kbcli docs, call scripts/sync-kbcli-docs.sh
	@./scripts/sync-kbcli-docs.sh $(BRANCH)
	$(YARN) format-md-to-mdx