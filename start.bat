@echo off
echo Starting Prediction Market Application...
echo.

echo Installing dependencies...
call npm run install-all

echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo.
echo Starting frontend server...
start "Frontend Server" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Frontend will be available at: http://localhost:3000
echo Backend will be available at: http://localhost:5000
echo.
echo Press any key to exit this window...
pause >nul 