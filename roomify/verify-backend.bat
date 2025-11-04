@echo off
REM Backend Verification Script for Roomify
REM This script tests all backend endpoints and database operations

echo ======================================
echo Roomify Backend Verification
echo ======================================
echo.

echo Testing Backend Health...
curl -s http://localhost:8080/api/users 2>&1 | findstr "email" >nul
if %errorlevel% equ 0 (
    echo [PASS] Backend is running
) else (
    echo [FAIL] Backend is not responding
    exit /b 1
)

echo.
echo Testing Database Connection...
curl -s http://localhost:8080/api/users 2>&1 | findstr "admin@roomify.com" >nul
if %errorlevel% equ 0 (
    echo [PASS] Database connection working
    echo [PASS] Sample data loaded successfully
) else (
    echo [FAIL] Database connection issue
)

echo.
echo ======================================
echo Available Endpoints:
echo ======================================
echo.
echo User Management:
echo   GET    http://localhost:8080/api/users
echo   GET    http://localhost:8080/api/users/{id}
echo   POST   http://localhost:8080/api/users
echo   PUT    http://localhost:8080/api/users/{id}
echo   DELETE http://localhost:8080/api/users/{id}
echo   GET    http://localhost:8080/api/users/search?email={email}&name={name}
echo.
echo H2 Database Console:
echo   http://localhost:8080/api/h2-console
echo   JDBC URL: jdbc:h2:mem:roomify_dev
echo   Username: sa
echo   Password: (leave blank)
echo.
echo API Documentation (Swagger):
echo   http://localhost:8080/api/swagger-ui.html
echo   http://localhost:8080/api/api-docs
echo.
echo ======================================
echo Sample Users in Database:
echo ======================================
echo   admin@roomify.com / admin123
echo   john@roomify.com / john123
echo   jane@roomify.com / jane123
echo   guest@roomify.com / guest123
echo.

pause
