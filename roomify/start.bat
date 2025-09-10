@echo off
echo 🚀 Starting RoomiFy Application...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose and try again.
    pause
    exit /b 1
)

echo 📦 Building and starting services...
docker-compose up --build -d

echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

echo 🔍 Checking service status...
docker-compose ps

echo.
echo ✅ RoomiFy is starting up!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8080/api
echo 📚 API Docs: http://localhost:8080/api/swagger-ui.html
echo 🗄️  Database: localhost:5432
echo.
echo 🔑 Test Users:
echo    - Email: john@example.com, Password: password123
echo    - Email: jane@example.com, Password: password123
echo    - Email: mike@example.com, Password: password123
echo.
echo 🛑 To stop the application, run: docker-compose down
echo 📊 To view logs, run: docker-compose logs -f
echo.
pause
