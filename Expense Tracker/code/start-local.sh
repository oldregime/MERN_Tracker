#!/bin/bash

echo "🚀 Starting Personal Finance Tracker locally..."
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env file not found!"
    echo "Run ./setup-env.sh first"
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Start backend in background
echo "📦 Starting backend server on port 5000..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend on port 3000..."
cd frontend
PORT=3000 npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Application started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
