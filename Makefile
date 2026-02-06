.PHONY: run dev

dev: run

up:
	@echo "Starting local server with uv..."
	uv run python3 -m http.server 8005
