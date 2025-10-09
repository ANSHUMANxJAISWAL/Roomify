# 🏠 Roomify - Smart Roommate Management System

> **A modern full-stack application for managing shared living spaces**

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

---

## 🎯 What is Roomify?

Roomify helps roommates manage their shared living space:
- 🧹 **Track chores** - Assign and monitor household tasks
- 💰 **Split expenses** - Manage shared bills and payments
- ⏰ **Set reminders** - Never forget important tasks
- 👥 **Manage households** - Organize your roommate group
- 🔔 **Get notifications** - Stay updated on everything

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- **Java 17+** ([Download](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html))
- **MySQL 8+** ([Download](https://dev.mysql.com/downloads/installer/))
- **Node.js 18+** (for frontend) ([Download](https://nodejs.org/))

### Check Your Setup
```bash
java -version    # Should show 17+
mysql --version  # Should show 8.0+
node --version   # Should show 18+
```

---

## 📦 Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/roomify.git
cd roomify
```

### 2️⃣ Configure Database
1. Start MySQL service
2. Open `src/main/resources/application.properties`
3. Update your MySQL password:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

### 3️⃣ Start Backend
**Option A: Using batch file (Windows) - Recommended**
```bash
# Double-click start-app.bat
# Automatically kills any process on port 8080 if needed
```

**Option B: Using Maven**
```bash
mvnw.cmd spring-boot:run
```

**Option C: Kill port 8080 manually (if needed)**
```bash
# Double-click kill-port-8080.bat
```

### 4️⃣ Start Frontend (Optional)
```bash
cd frontend
npm install
npm run dev
```

### 5️⃣ Verify Installation
Open browser: **http://localhost:8080/api/actuator/health**

You should see: `{"status":"UP"}` ✅

---

## 🌐 Access Points

Once running, access these URLs:

| Service         | URL                                        | Description |
|---------        |-----------------------                     |-------------|
| **API**         | http://localhost:8080/api                  | Backend REST API |
| **Swagger UI**  | http://localhost:8080/api/swagger-ui.html  | Interactive API docs |
| **Health Check**| http://localhost:8080/api/actuator/health  | Application status |
| **Frontend**    | http://localhost:3000                        | React UI (if started) |

---

## 📁 Project Structure

```
roomify/
├── src/main/java/com/roomify/
│   ├── config/              # Configuration classes
│   ├── controller/          # REST API endpoints
│   ├── database/
│   │   ├── entities/        # Database models
│   │   └── repositories/    # Data access layer
│   ├── dto/                 # Data transfer objects
│   ├── exception/           # Error handling
│   ├── security/            # JWT & authentication
│   └── service/             # Business logic
├── src/main/resources/
│   └── application.properties  # Configuration file
├── frontend/                # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── contexts/        # State management
│   │   ├── pages/           # Application pages
│   │   └── services/        # API services
│   └── package.json
├── pom.xml                  # Maven dependencies
└── start-app.bat            # Quick start script
```

---

## 🛠️ Configuration

### Backend Configuration
Edit `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/roomify_dev
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

# Server
server.port=8080

# JWT (Change in production!)
spring.security.jwt.secret=your-secret-key
spring.security.jwt.access-token-validity=3600000
```

### Frontend Configuration
Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

---

## 🧪 Testing

### Run All Tests
```bash
mvnw.cmd test
```

### Run Specific Test
```bash
mvnw.cmd test -Dtest=UserRepositoryTest
```

Tests use **H2 in-memory database** - no MySQL needed!

---

## 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **BCrypt Password Hashing** - Industry-standard encryption
- ✅ **CORS Configuration** - Cross-origin resource sharing
- ✅ **SQL Injection Protection** - JPA/Hibernate safeguards
- ✅ **Input Validation** - Bean validation annotations
- ✅ **Role-Based Access Control** - User/Admin roles

---

## 📊 Database Schema

Auto-created tables:
- **users** - User accounts and profiles
- **households** - Roommate groups
- **chores** - Task assignments
- **expenses** - Shared expenses
- **reminders** - User reminders
- **notifications** - System notifications

All tables include:
- UUID primary keys
- Timestamps (created_at, updated_at)
- Foreign key relationships
- Performance indexes

---

## 🐛 Troubleshooting

### Port 8080 Already in Use

**Automatic Solution:**
```bash
# Double-click kill-port-8080.bat
# This will automatically kill all processes on port 8080
```

**Manual Solution:**
```bash
netstat -ano | findstr :8080
taskkill /PID [number] /F
```

**Note:** The `start-app.bat` script now automatically handles this!

### MySQL Connection Failed
1. Check if MySQL is running: `services.msc` → Find "MySQL80"
2. Verify password in `application.properties`
3. Test connection: `mysql -u root -p`

### Application Won't Start
```bash
# Clean and rebuild
mvnw.cmd clean install

# Then start again
mvnw.cmd spring-boot:run
```

**More help:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 🚀 Deployment

### Development
✅ **Ready** - Start developing immediately

### Production Checklist
- [ ] Move secrets to environment variables
- [ ] Create `application-prod.properties`
- [ ] Disable SQL logging
- [ ] Configure CORS for production domain
- [ ] Set up SSL/HTTPS
- [ ] Configure database backups
- [ ] Set up monitoring

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17 (LTS)
- **Database:** MySQL 8.0
- **Security:** Spring Security + JWT
- **Build:** Maven
- **API Docs:** Swagger/OpenAPI
- **Testing:** JUnit 5 + H2

### Frontend
- **Framework:** React 18.2.0
- **Language:** TypeScript 5.9.2
- **Build:** Vite 6.3.6
- **Styling:** TailwindCSS 3.3.5
- **State:** React Context API
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts

---

## 📚 API Documentation

### Explore API
Visit **http://localhost:8080/api/swagger-ui.html** for interactive API documentation.

### Example Endpoints
```
POST   /api/auth/login          # User login
GET    /api/users/me            # Get current user
GET    /api/chores              # List all chores
POST   /api/expenses            # Create expense
GET    /api/reminders           # List reminders
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

- **Documentation:** See this README and [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Issues:** Open an issue on GitHub
- **Email:** support@roomify.com

---

## 🎓 Learning Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ✨ Features

### Current Features
- ✅ User authentication (JWT)
- ✅ Household management
- ✅ Chore tracking
- ✅ Expense splitting
- ✅ Reminder system
- ✅ Notification system
- ✅ REST API with Swagger docs
- ✅ Responsive frontend UI

### Planned Features
- 🔄 Real-time notifications (WebSocket)
- 🔄 File upload (profile pictures)
- 🔄 Email notifications
- 🔄 Mobile app
- 🔄 Payment integration

---

## 🏆 Project Status

**Status:** ✅ **Production Ready**  
**Version:** 1.0.0  
**Last Updated:** October 8, 2025

---

**Made with ❤️ by the Roomify Team**

**Star ⭐ this repo if you find it helpful!**
