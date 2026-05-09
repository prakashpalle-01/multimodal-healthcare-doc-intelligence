.PHONY: install dev test lint compose-up compose-down

install:
	python -m venv .venv
	. .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt

dev:
	uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload

test:
	pytest

lint:
	ruff check .

compose-up:
	docker compose up -d

compose-down:
	docker compose down
