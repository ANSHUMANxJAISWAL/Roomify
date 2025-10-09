@echo off
echo ========================================
echo   Kill Process on Port 8080
echo ========================================
echo.

echo Checking port 8080...
netstat -ano | findstr :8080 | findstr LISTENING >nul

if errorlevel 1 (
    echo [INFO] No process is using port 8080
    echo Port is already free!
    echo.
    pause
    exit /b 0
)

echo [WARNING] Port 8080 is in use!
echo.
echo Processes using port 8080:
netstat -ano | findstr :8080 | findstr LISTENING
echo.

echo Killing all processes on port 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo Killing PID: %%a
    taskkill /PID %%a /F
)

echo.
echo [OK] All processes on port 8080 have been terminated!
echo.
pause
