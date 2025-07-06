#!/bin/bash

echo "Starting Prediction Market Application..."
echo

echo "Installing dependencies..."
npm run install-all

echo
echo "Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

echo
echo "Starting frontend server..."
cd .. && npm start &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend will be available at: http://localhost:5000"
echo
echo "Press Ctrl+C to stop both servers..."

# Wait for user to stop the servers
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 