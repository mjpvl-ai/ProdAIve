#!/bin/bash
livekit-server --dev &
uv run uvicorn backend_services.main:app --reload --host 0.0.0.0 --port 8080
