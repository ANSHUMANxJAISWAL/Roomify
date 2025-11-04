@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   Welcome to Roomify! (Optimized Startup)
echo ========================================
echo.

:: Skip MySQL service check since we're using H2 in-memory database
echo [INFO] Skipping MySQL service check (using H2 in-memory database)...

echo [OK] Proceeding with H2 database setup!

:: Check and free port 8080 if needed
netstat -ano | findstr :8080 | findstr LISTENING >nul
if not errorlevel 1 (
    echo [INFO] Freeing up port 8080...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 1 /nobreak >nul
)

echo [INFO] Starting Roomify with optimizations...
echo [INFO] This will be faster than before...
echo.

:: Set Maven and JVM optimizations with debug info
set "MAVEN_OPTS=-Xmx1024m -Xms256m -XX:+TieredCompilation -XX:TieredStopAtLevel=1"
set "SPRING_OUTPUT_ANSI_ENABLED=ALWAYS"

:: Enable debug logging for Spring Boot startup
echo [INFO] Starting with debug logging enabled...

:: Run with optimizations and debug output
call mvnw.cmd spring-boot:run ^
  -DskipTests ^
  --no-transfer-progress ^
  -Dspring-boot.run.jvmArguments="-Xmx512m -Xms128m -XX:+UseG1GC -XX:+UseStringDeduplication -Dlogging.level.org.springframework=DEBUG -Dlogging.level.com.roomify=DEBUG -Dspring.main.lazy-initialization=false -Dspring.main.log-startup-info=true -Ddebug=true"

if errorlevel 1 (
    echo.
    echo [ERROR] Application failed to start or took too long!
    echo.
    echo Troubleshooting steps:
    echo 1. Check if port 8080 is available
    echo 2. Verify database connection in application.properties
    echo 3. Try cleaning and rebuilding: mvn clean install -DskipTests
    echo 4. Check for port conflicts: netstat -ano | findstr :8080
    echo 5. Look for detailed logs in: target/logs/spring.log
    echo.
    echo [TROUBLESHOOTING TIP] If stuck on database initialization:
    echo - Add this to VM options: -Dspring.jpa.hibernate.ddl-auto=validate
    echo - Or clean database and restart: mvn spring-boot:run -DskipTests -Dspring.jpa.hibernate.ddl-auto=create
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Application started in optimized mode!
echo ========================================
echo.
echo Quick Access:
echo - API: http://localhost:8080/api
echo - Swagger: http://localhost:8080/api/swagger-ui.html
echo - Health: http://localhost:8080/api/actuator/health
echo - H2 Console: http://localhost:8080/api/h2-console
echo.
echo [TIP] Press Ctrl+C to stop
echo.

:: Keep the window open
pause