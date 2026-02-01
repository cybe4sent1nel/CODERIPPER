#!/bin/bash
# =========================================
# CodeRipper - Development Startup Script
# =========================================
# This script starts all CodeRipper services
# Run from the root directory: ./start-dev.sh
# =========================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  CodeRipper - Enterprise Code Platform${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "web/package.json" ]; then
    echo -e "${RED}ERROR: Please run this script from the CodeRipper root directory${NC}"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org${NC}"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}ERROR: npm is not found. Please reinstall Node.js${NC}"
    exit 1
fi

echo -e "${GREEN}[1/5]${NC} Checking environment configuration..."
if [ ! -f "web/.env.local" ]; then
    echo "Creating .env.local from .env.example..."
    cp "web/.env.example" "web/.env.local"
    echo -e "${YELLOW}NOTE: Please edit web/.env.local with your API keys${NC}"
fi

echo -e "${GREEN}[2/5]${NC} Installing web dependencies..."
cd web
npm install --silent 2>/dev/null || npm install
cd ..

echo -e "${GREEN}[3/5]${NC} Checking for Docker (optional for code execution)..."
if command -v docker &> /dev/null; then
    echo "Docker found. Code execution service will be available."
    DOCKER_AVAILABLE=1
else
    echo -e "${YELLOW}Docker not found. Code execution will use simulation mode.${NC}"
    DOCKER_AVAILABLE=0
fi

echo -e "${GREEN}[4/5]${NC} Starting services..."
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "Shutting down services..."
    if [ ! -z "$EXEC_PID" ]; then
        kill $EXEC_PID 2>/dev/null || true
    fi
    echo "Done."
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start exec-engine if Docker is available and Go is installed
EXEC_PID=""
if [ "$DOCKER_AVAILABLE" == "1" ] && command -v go &> /dev/null; then
    echo "Starting exec-engine in background..."
    cd services/exec-engine
    go run main.go &
    EXEC_PID=$!
    cd ../..
    sleep 2
fi

echo -e "${GREEN}[5/5]${NC} Starting web application..."
echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  CodeRipper is starting...${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo "  Web App:      http://localhost:3000"
echo "  API:          http://localhost:3000/api"
if [ "$DOCKER_AVAILABLE" == "1" ]; then
    echo "  Exec Engine:  http://localhost:8081"
fi
echo ""
echo "  Press Ctrl+C to stop all services"
echo -e "${BLUE}============================================${NC}"
echo ""

cd web
npm run dev

# Will reach here if npm exits
cleanup
