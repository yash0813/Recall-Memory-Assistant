#!/bin/bash

# Kill background processes on exit
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

echo "🟣 Recall Vibe System Initializing..."

# Check if .venv exists
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r backend/requirements.txt
else
    source .venv/bin/activate
fi

# Start Backend
echo "🧠 Booting Memory Core (Backend port 8000)..."
cd backend
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "👁️ Opening Eyes (Frontend port 3000)..."
cd frontend
# Ensure dependencies are installed if node_modules missing
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Recall is Online."
echo "   Backend: http://localhost:8000/docs"
echo "   Frontend: http://localhost:3000"
echo "   (Press Ctrl+C to stop)"

wait
