# H2 Database Storage Configuration

This document describes the H2 database storage configuration for the Roomify application.

## Current Configuration

### Development Environment
- **Database Type**: H2 Database (File-based)
- **Storage Location**: `./data/roomify_dev`
- **JDBC URL**: `jdbc:h2:file:./data/roomify_dev;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;AUTO_SERVER=TRUE`
- **Username**: `sa`
- **Password**: `password`

### Configuration Files
- **Primary Config**: `src/main/resources/application-dev.yml`
- **Backup Config**: `src/main/resources/application.yml` (MySQL for production)

## Database Files

### File Location
H2 database files are stored in the `data/` directory at the project root:

```
roomify/
├── data/
│   ├── roomify_dev.mv.db      # Main database file (contains all data)
│   └── roomify_dev.trace.db   # Trace/log file (for debugging)
└── ...
```

### File Types
- **`.mv.db`**: Main database file containing all tables, data, and indexes
- **`.trace.db`**: Trace file containing SQL execution logs (for development/debugging)

## Switching Database Modes

### File-based Storage (Current - Development)
```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/roomify_dev;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;AUTO_SERVER=TRUE
  jpa:
    hibernate:
      ddl-auto: validate
```

**Benefits:**
- ✅ Data persists between application restarts
- ✅ Multiple application instances can access the same database
- ✅ Good for development and testing
- ✅ Easy to backup and restore

**Drawbacks:**
- ❌ Files are stored in the project directory
- ❌ Not suitable for production (use MySQL/PostgreSQL instead)

### In-Memory Storage (Previous Configuration)
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:roomify_dev;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
  jpa:
    hibernate:
      ddl-auto: create-drop
```

**Benefits:**
- ✅ Very fast startup
- ✅ No disk I/O
- ✅ Clean state on each restart

**Drawbacks:**
- ❌ Data lost when application stops
- ❌ Cannot share data between instances
- ❌ Not suitable for production

### Production Database (MySQL)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/roomify_dev?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
    username: root
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
```

## Scripts and Utilities

### Database Location Script
Use the provided scripts to locate and verify database files:

**Linux/Mac:**
```bash
./scripts/dump-h2-location.sh
```

**Windows:**
```cmd
.\scripts\dump-h2-location.bat
```

These scripts will:
- Show current working directory
- Check if data directory exists
- List all H2 database files
- Display current database configuration
- Provide startup instructions

### Manual Database Access
You can also access the H2 database directly using the H2 Console:

1. Start the application
2. Open browser to: `http://localhost:8080/api/h2-console`
3. Use these connection settings:
   - **JDBC URL**: `jdbc:h2:file:./data/roomify_dev`
   - **Username**: `sa`
   - **Password**: `password`

## Migration Between Modes

### From In-Memory to File-based
The application will automatically create the database files when switching from in-memory to file-based mode. The schema will be created based on your JPA entities.

### From File-based to In-Memory
⚠️ **WARNING**: This will delete all data!

To switch back to in-memory:
1. Stop the application
2. Delete the `data/` directory
3. Update `application-dev.yml` to use `jdbc:h2:mem:roomify_dev`
4. Restart the application

### To Production Database
1. Set up MySQL database
2. Update connection settings in `application.yml`
3. Run database migrations if using Flyway
4. Switch active profile to `prod`

## Troubleshooting

### Database Files Not Created
- Ensure the `data/` directory exists and is writable
- Check application logs for H2 initialization errors
- Verify the JDBC URL in configuration files

### Permission Issues
- On Windows: Ensure no antivirus is blocking file creation
- On Linux/Mac: Check file permissions: `chmod 755 data/`

### Database Connection Errors
- Verify the JDBC URL format
- Check if another instance is using the database
- Look for port conflicts (H2 web console uses port 8080)

### Data Corruption
- Always backup the `.mv.db` file before manual modifications
- Use H2 Console for safe database operations
- Check trace logs in `.trace.db` for error details

## Best Practices

1. **Development**: Use file-based H2 for data persistence during development
2. **Testing**: Use in-memory H2 for fast, isolated tests
3. **Production**: Use MySQL or PostgreSQL for scalability and reliability
4. **Backup**: Regularly backup the `.mv.db` file in development
5. **Version Control**: Do NOT commit database files to version control (they're in `.gitignore`)

## Configuration Examples

### Custom Storage Location
To store database files in a different location:
```yaml
spring:
  datasource:
    url: jdbc:h2:file:C:/path/to/databases/roomify_dev;DB_CLOSE_DELAY=-1
```

### Disable Auto-Server Mode
For single-instance applications:
```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/roomify_dev;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
```

### Enable Database Encryption
```yaml
spring:
  datasource:
    url: jdbc:h2:file:./data/roomify_dev;DB_CLOSE_DELAY=-1;CIPHER=AES
    password: your_encryption_password
```
