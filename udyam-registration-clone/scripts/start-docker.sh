#!/bin/bash

echo "Starting Udyam Registration Clone with Docker..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start containers
docker-compose up -d --build

echo "✅ Docker containers started!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"

# Show container status
docker-compose ps
