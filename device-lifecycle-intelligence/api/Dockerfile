FROM python:3.12-slim

WORKDIR /app

# curl and dos2unix are required for health check and CRLF fixes
RUN apt-get update && apt-get install -y --no-install-recommends curl dos2unix && rm -rf /var/lib/apt/lists/*

# Install dependencies first (cached layer)
COPY requirements.txt .
RUN dos2unix requirements.txt && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .
RUN find . -type f \( -name "*.py" -o -name "*.sh" -o -name "*.cfg" -o -name "*.ini" -o -name "*.txt" \) -exec dos2unix {} +

EXPOSE 80

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
