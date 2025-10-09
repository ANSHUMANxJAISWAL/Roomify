@echo off
echo ========================================
echo   Welcome to Roomify!
echo ========================================
echo.
echo Checking if MySQL is running...
sc query MySQL80 | find "RUNNING" >nul
if errorlevel 1 (
    echo [ERROR] MySQL is not running!
    echo Please start MySQL service and try again.
    echo.
    echo To start MySQL:
    echo 1. Press Windows + R
    echo 2. Type: services.msc
    echo 3. Find MySQL80 and click Start
    echo.
    pause
    exit /b 1
)
echo [OK] MySQL is running!
echo.

echo Checking port 8080...
netstat -ano | findstr :8080 | findstr LISTENING >nul
if not errorlevel 1 (
    echo [WARNING] Port 8080 is already in use!
    echo Killing existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
        taskkill /PID %%a /F >nul 2>&1
        echo [OK] Process %%a killed successfully!
    )
    timeout /t 2 /nobreak >nul
) else (
    echo [OK] Port 8080 is available!
)
echo.

echo Starting Roomify application...
echo This may take a minute...
echo.

call mvnw.cmd spring-boot:run

if errorlevel 1 (
    echo.
    echo [ERROR] Application failed to start!
    echo Please check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Application started successfully!
echo ========================================
echo.
echo Access the application at:
echo - API: http://localhost:8080/api
echo - Swagger UI: http://localhost:8080/api/swagger-ui.html
echo - Health Check: http://localhost:8080/api/actuator/health
echo.
echo Press Ctrl+C to stop the application
echo.
pause
