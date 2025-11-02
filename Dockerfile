FROM python:3.11-slim-bullseye

ENV PYTHONUNBUFFERED 1
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

WORKDIR /app

# Install curl and livekit
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
# RUN curl -sSL https://get.livekit.io | bash

COPY backend_services /app/backend_services
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

RUN pip install uv

RUN uv venv

RUN uv pip install -r backend_services/requirements.txt

EXPOSE 8080

CMD ["/app/start.sh"]
