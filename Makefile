# CodeRipper - Development Commands
.PHONY: build up web-build exec-build ai-build dev start clean install

# Quick start - install dependencies and run dev server
dev: install
	cd web && npm run dev

# Start all services (with Docker)
start:
	docker compose -f infra/docker-compose.yml up --build

# Install dependencies
install:
	cd web && npm install

# Build all services
build: exec-build ai-build web-build

exec-build:
	cd services/exec-engine && docker build -t coderipper/exec-engine:local .

ai-build:
	cd services/ai-service && docker build -t coderipper/ai-service:local .

web-build:
	cd web && npm ci && npm run build

up:
	docker compose -f infra/docker-compose.yml up --build

down:
	docker compose -f infra/docker-compose.yml down

# Clean up
clean:
	docker compose -f infra/docker-compose.yml down -v --remove-orphans
	rm -rf web/node_modules web/.next

# Run only web (no Docker required)
web:
	cd web && npm run dev

# Run exec-engine locally (requires Go)
exec:
	cd services/exec-engine && go run main.go

# Setup environment
setup:
	@if [ ! -f web/.env.local ]; then cp web/.env.example web/.env.local; fi
	@echo "Environment file created. Edit web/.env.local with your API keys."
