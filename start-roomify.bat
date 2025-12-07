@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   ROOMIFY - Start Application
echo ========================================
echo.

REM Kill processes on ports 8080, 3000, 3001, and 5173 if they exist
echo [*] Checking for processes on ports 8080, 3000, 3001, and 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080"') do (
    echo [*] Killing process on port 8080 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do (
    echo [*] Killing process on port 3000 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do (
    echo [*] Killing process on port 3001 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do (
    echo [*] Killing process on port 5173 (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

timeout /t 2 /nobreak >nul 2>&1

REM Compile backend
echo.
echo [*] Compiling backend...
cd /d "c:\Users\anshu\OneDrive\Desktop\PROJECTS\Roomify\roomify"
call .\mvnw.cmd clean package -DskipTests -q

if errorlevel 1 (
    echo.
    echo [ERROR] Backend compilation failed!
    pause
    exit /b 1
)

echo [✓] Backend compiled successfully!

REM Start backend
echo.
echo [*] Starting backend on port 8080...
start "Roomify Backend" cmd /k "cd /d c:\Users\anshu\OneDrive\Desktop\PROJECTS\Roomify\roomify && java -jar target\roomify-backend-1.0.0.jar"

timeout /t 8 /nobreak

REM Start frontend
echo [*] Starting frontend (Vite will auto-select available port)...
start "Roomify Frontend" cmd /k "cd /d c:\Users\anshu\OneDrive\Desktop\PROJECTS\Roomify\roomify\frontend && npm run dev"

timeout /t 5 /nobreak

echo.
echo ========================================
echo   ROOMIFY - Ready to Use!
echo ========================================
echo.
echo Opening links in browser...
echo.

REM Check which port Vite is actually using and open it
REM Open URLs in default browser (Note: Frontend might be on 3000, 3001, or 5173)
start "" "http://localhost:3000"
timeout /t 1 /nobreak >nul 2>&1
start "" "http://localhost:8080/api/swagger-ui.html"
timeout /t 1 /nobreak >nul 2>&1
start "" "http://localhost:8080/api/h2-console"

echo.
echo ========================================
echo   USEFUL LINKS
echo ========================================
echo.
echo Frontend:     http://localhost:3000 (or check console for actual port)
echo Backend API:  http://localhost:8080/api/swagger-ui.html
echo H2 Database:  http://localhost:8080/api/h2-console
echo.
echo H2 Console Login:
echo   JDBC URL:  jdbc:h2:mem:roomify_dev
echo   Username:  SA
echo   Password:  (leave blank)
echo.
echo Sample Test Data:
echo   - 4 Users (admin, john, jane, guest)
echo   - 3 Households (Downtown Apartment, Sunset Villa, Campus Housing)
echo   - 8 Sample Expenses with splits
echo.
echo ========================================
echo.
pause
