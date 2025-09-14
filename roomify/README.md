# 🏠 RoomiFy - Complete Household Management Application

**Status: ✅ COMPLETE AND READY TO RUN!**

RoomiFy is a comprehensive household management application that helps roommates organize chores, track expenses, manage reminders, and stay connected. Built with modern technologies and best practices.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or later
- **Node.js** (v18 or later) and **npm** (v9 or later)
- **PostgreSQL** (v14 or later)
- **Maven** (v3.8 or later)
- **Git** (for cloning the repository)

## 🎯 **What This Application Does**

- **👥 User Management**: Secure registration, login, and profile management
- **🏠 Household Management**: Create and manage shared living spaces
- **🧹 Chore Management**: Assign, track, and complete household tasks
- **💰 Expense Tracking**: Manage shared expenses and bills with roommate splits
- **⏰ Reminders**: Set and track important reminders and deadlines
- **🔔 Notifications**: Real-time updates and alerts for all activities
- **📊 Analytics**: Track progress and household statistics

## 🚀 **Quick Start - Ready to Run!**

### **Setup Instructions**

#### 1. Database Setup
1. Make sure PostgreSQL is running on your machine
2. Create a new database named `roomify`:
   ```sql
   CREATE DATABASE roomify;
   ```
3. Update the database credentials in `src/main/resources/application.yml` if needed (defaults are already set):
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/roomify
       username: postgres
       password: 123456
   ```

#### 2. Backend Setup
1. Open a terminal in the project root directory
2. Build and run the Spring Boot application:
   ```bash
   # Install dependencies and build the project
   mvn clean install
   
   # Run the application
   mvn spring-boot:run
   ```
3. The backend should now be running at `http://localhost:8080`

#### 3. Frontend Setup
1. Open a new terminal in the project root directory
2. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend should now be running at `http://localhost:3000`

### **Option 3: Test Mode (Quick Verification)**
```bash
# Test the backend only
test-app.bat

# Then visit: http://localhost:8080/test/health
```

## 🌐 **Access Points**

Once everything is running, you can access:
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **API Documentation (Swagger UI)**: http://localhost:8080/api/swagger-ui.html
- **Database Admin** (if using pgAdmin): http://localhost:5050

## 🔍 **Verifying the Setup**

1. **Backend Health Check**: 
   - Visit: http://localhost:8080/test/health
   - Should return: `{"status":"UP"}`

2. **Database Connection**:
   - The application will automatically create the necessary tables on first run
   - Check the console logs for any database connection errors

3. **Frontend**:
   - Open http://localhost:3000 in your browser
   - You should see the RoomiFy login page

## 🔑 **Default Test Users**

You can use these pre-configured accounts to log in:

| Email             | Password   | Role   |
|-------------------|------------|--------|
| admin@roomify.com | admin123   | ADMIN  |
| john@example.com  | password123| USER   |
| jane@example.com  | password123| USER   |

## 🛠️ **Troubleshooting**

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running
   - Verify the database credentials in `application.yml`
   - Check if the `roomify` database exists

2. **Port Already in Use**
   - If port 8080 or 3000 is in use, you can change them in:
     - Backend: `src/main/resources/application.yml` (server.port)
     - Frontend: `frontend/vite.config.ts` (server.port)

3. **Frontend Not Connecting to Backend**
   - Check if the backend is running
   - Verify the API URL in `frontend/src/config/api.ts`
   - Look for CORS errors in the browser console

4. **Missing Dependencies**
   - For backend: Run `mvn clean install`
   - For frontend: Run `npm install` in the frontend directory

## 🔑 **Test Users (Pre-configured)**

- **Email**: john@example.com, **Password**: password123
- **Email**: jane@example.com, **Password**: password123  
- **Email**: mike@example.com, **Password**: password123

## 🏗️ **Technology Stack**

### **Backend**
- **Java 17** with **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **PostgreSQL** (primary) + H2 (development)
- **Maven** for dependency management
- **RESTful API** with proper DTOs and validation

### **Frontend**
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive design
- **React Router** for navigation
- **Axios** for API communication
- **React Hook Form** + **Zod** for form validation

### **Infrastructure**
- **Docker** + **Docker Compose** for containerization
- **PostgreSQL** database with sample data
- **Comprehensive error handling** and validation
- **Security best practices** implemented

## 📁 **Project Structure**

```
roomify/
├── src/main/java/com/roomify/
│   ├── config/          # Security and application configuration
│   ├── controller/      # REST API endpoints
│   ├── dto/            # Data Transfer Objects
│   ├── entity/         # JPA entities
│   ├── exception/      # Custom exception handling
│   ├── repository/     # Data access layer
│   ├── security/       # JWT and security components
│   └── service/        # Business logic layer
├── src/main/resources/ # Configuration and database scripts
├── frontend/           # React application
├── docker-compose.yml  # Complete application stack
├── Dockerfile          # Backend container
├── start.sh/start.bat  # Startup scripts
└── README.md          # This documentation
```

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Database
DB_USERNAME=postgres
DB_PASSWORD=password
DB_URL=jdbc:postgresql://localhost:5432/roomify

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_VALIDITY=900000
JWT_REFRESH_VALIDITY=86400000

# Server
SERVER_PORT=8080
SERVER_CONTEXT_PATH=/api
```

### **Application Properties**
- **Database**: PostgreSQL with H2 fallback
- **Security**: JWT-based authentication
- **CORS**: Configured for frontend integration
- **Logging**: Comprehensive logging configuration
- **API Documentation**: Swagger/OpenAPI enabled

## 🚀 **Deployment**

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **Traditional Deployment**
```bash
# Backend
mvn clean package
java -jar target/roomify-backend-1.0.0.jar

# Frontend
cd frontend
npm run build
# Serve dist/ folder with any web server
```

## 🧪 **Testing the Application**

1. **Start the backend**: `mvn spring-boot:run`
2. **Test health endpoint**: Visit `http://localhost:8080/test/health`
3. **Start the frontend**: `cd frontend && npm run dev`
4. **Test connectivity**: Visit the test page at `/test`
5. **Login with test users**: Use the credentials above

## 📚 **API Documentation**

Once running, visit:
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/v3/api-docs

## 🔍 **Troubleshooting**

### **Common Issues**
- **Port conflicts**: Ensure ports 8080, 3000, and 5432 are available
- **Database connection**: Verify PostgreSQL is running and accessible
- **Frontend build**: Ensure Node.js 18+ is installed
- **Java version**: Ensure Java 17+ is installed

### **Logs and Debugging**
```bash
# Backend logs
mvn spring-boot:run

# Docker logs
docker-compose logs -f backend

# Database connection
docker-compose logs -f postgres
```

## 🎉 **What's Complete**

✅ **Backend**: All services, controllers, DTOs, and security  
✅ **Frontend**: React app with API integration  
✅ **Database**: Complete schema with sample data  
✅ **Authentication**: JWT-based security system  
✅ **Docker**: Full containerization setup  
✅ **Documentation**: Comprehensive guides and examples  
✅ **Error Handling**: Global exception handling  
✅ **Validation**: Input validation and sanitization  
✅ **Testing**: Health endpoints and test pages  

## 🚀 **Ready to Use!**

Your RoomiFy application is now **100% complete** and ready to run! 

- **Start with Docker**: `start.bat` (Windows) or `./start.sh` (Mac/Linux)
- **Test quickly**: `test-app.bat` for backend verification
- **Full stack**: Complete frontend + backend + database
- **Production ready**: Proper security, error handling, and validation

## 📞 **Support**

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check the logs for specific error messages
4. Ensure ports are not in use by other applications

---

**🎯 RoomiFy is now a complete, production-ready household management application!**
