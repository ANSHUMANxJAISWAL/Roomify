@echo off
REM Script to locate and display H2 database files for Roomify (Windows version)

echo === Roomify H2 Database Location Script ===
echo.

REM Display current working directory
echo Current working directory: %CD%
echo.

REM Check if data directory exists
if exist ".\data" (
    echo ✅ Data directory exists: .\data
    echo Contents of data directory:
    dir /b ".\data"
    echo.

    REM Look for H2 database files
    echo H2 Database files found:
    dir /b /s ".\data\*.db" ".\data\*.mv.db" ".\data\*.trace.db" 2^>nul
    echo.

    REM Show database URL configuration
    echo Database configuration:
    if exist "src\main\resources\application-dev.yml" (
        echo From application-dev.yml:
        findstr /C:"datasource:" "src\main\resources\application-dev.yml"
    )
) else (
    echo ❌ Data directory not found: .\data
    echo H2 database files will be created when the application starts.
)

echo.
echo Expected database URL: jdbc:h2:file:./data/roomify_dev
echo Database files will be stored as:
echo   - .\data\roomify_dev.mv.db (main database file)
echo   - .\data\roomify_dev.trace.db (trace/log file)
echo.
echo To start the application: .\mvnw.cmd spring-boot:run
echo.
pause
