# Build configuration
TAG ?= latest
IMG ?= apecloud/kubeblocks-docs
BUILDX_NAME = kubeblocks-docs-xbuilder

# Tool configurations
YARN := yarn
DOCKER := docker
PLATFORMS := linux/arm64,linux/amd64

# Help target
.PHONY: help
help: ## 显示帮助信息
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: all
all: docker-build ## 默认目标：构建 Docker 镜像

# Build targets
.PHONY: build
build: ## 构建源代码
	@echo "Building source code..."
	$(YARN) install && $(YARN) build

# Docker targets
.PHONY: docker-buildx-setup
docker-buildx-setup: ## 设置 docker buildx
	@if ! $(DOCKER) buildx ls | grep -q "$(BUILDX_NAME)"; then \
		$(DOCKER) buildx create --name $(BUILDX_NAME) --use; \
	fi
	$(DOCKER) buildx use $(BUILDX_NAME)
	$(DOCKER) buildx inspect

.PHONY: docker-build
docker-build: build docker-buildx-setup ## 构建并推送 Docker 镜像
	$(DOCKER) buildx build \
		--platform=$(PLATFORMS) \
		-f Dockerfile \
		--push \
		-t $(IMG):$(TAG) .
	$(DOCKER) buildx rm $(BUILDX_NAME)

