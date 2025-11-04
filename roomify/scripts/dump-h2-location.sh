#!/bin/bash
# Script to locate and display H2 database files for Roomify

echo "=== Roomify H2 Database Location Script ==="
echo ""

# Display current working directory
echo "Current working directory: $(pwd)"

# Check if data directory exists
if [ -d "./data" ]; then
    echo "✅ Data directory exists: ./data"
    echo "Contents of data directory:"
    ls -la ./data/
    echo ""

    # Look for H2 database files
    echo "H2 Database files found:"
    find ./data -name "*.db" -o -name "*.mv.db" -o -name "*.trace.db" 2>/dev/null
    echo ""

    # Show database URL configuration
    echo "Database configuration:"
    if [ -f "src/main/resources/application-dev.yml" ]; then
        echo "From application-dev.yml:"
        grep -A 5 -B 1 "datasource:" src/main/resources/application-dev.yml
    fi
else
    echo "❌ Data directory not found: ./data"
    echo "H2 database files will be created when the application starts."
fi

echo ""
echo "Expected database URL: jdbc:h2:file:./data/roomify_dev"
echo "Database files will be stored as:"
echo "  - ./data/roomify_dev.mv.db (main database file)"
echo "  - ./data/roomify_dev.trace.db (trace/log file)"
echo ""
echo "To start the application: ./mvnw spring-boot:run"
