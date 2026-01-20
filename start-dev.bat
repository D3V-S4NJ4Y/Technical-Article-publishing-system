@echo off
echo Starting Technical Article Publishing System...
echo.

echo Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"
echo Backend server starting in new window...
echo.

echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo Starting Frontend Server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"
echo Frontend server starting in new window...
echo.

echo Both servers are starting up!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause > nul