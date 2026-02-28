.PHONY: build up down logs shell db-shell clean restart

## Build Docker images
build:
	docker compose build

## Start all services in detached mode
up:
	docker compose up -d

## Stop and remove containers + networks
down:
	docker compose down

## Tail API service logs (Ctrl+C to exit)
logs:
	docker compose logs -f api

## Open a bash shell inside the running API container
shell:
	docker compose exec api bash

## Open psql inside the running DB container
db-shell:
	docker compose exec db psql -U intara -d intara

## Stop containers AND delete volumes (full reset)
clean:
	docker compose down -v

## Shortcut: rebuild and restart everything
restart: down build up

# ── Alembic Migrations ────────────────────────────────────────

## Generate a new migration (usage: make migrate-gen msg="add xyz")
migrate-gen:
	docker compose exec api alembic revision --autogenerate -m "$(msg)"

## Apply all pending migrations
migrate:
	docker compose exec api alembic upgrade head

## Rollback the last migration
migrate-down:
	docker compose exec api alembic downgrade -1

## Show current migration revision
migrate-current:
	docker compose exec api alembic current

## Show migration history
migrate-history:
	docker compose exec api alembic history --verbose
