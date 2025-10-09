# 🔧 Troubleshooting Guide for Roomify

This guide helps you fix common problems when running Roomify. Each problem has a simple explanation and step-by-step solution.

## 🚨 Common Error Messages

### Error 1: "Port 8080 was already in use"

**What it means:**  
Another program is already using port 8080, so Roomify can't start.

**How to fix it:**

**Option A: Use the automatic script (Easiest!)**
1. Double-click `kill-port-8080.bat` in the project folder
2. The script will automatically kill all processes on port 8080
3. Try starting Roomify again

**Option B: Use start-app.bat (Automatic)**
- The `start-app.bat` script now automatically detects and kills any process on port 8080
- Just double-click `start-app.bat` and it handles everything!

**Option C: Manual method**
1. Open Command Prompt as Administrator
   - Press `Windows + X`
   - Click "Command Prompt (Admin)" or "PowerShell (Admin)"

2. Find what's using port 8080:
   ```bash
   netstat -ano | findstr :8080
   ```

3. You'll see something like:
   ```
   TCP    0.0.0.0:8080    0.0.0.0:0    LISTENING    1234
   ```
   The number at the end (1234) is the Process ID

4. Stop that process:
   ```bash
   taskkill /PID 1234 /F
   ```
   (Replace 1234 with your actual number)

5. Try starting Roomify again

**Option D: Change Roomify's port**
1. Open `src\main\resources\application.properties`
2. Find the line: `server.port=8080`
3. Change it to: `server.port=9000` (or any other number)
4. Save and restart Roomify

---

### Error 2: "Access denied for user 'root'@'localhost'"

**What it means:**  
The MySQL password in the configuration file doesn't match your actual MySQL password.

**How to fix it:**

1. Open `src\main\resources\application.properties`

2. Find these lines:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

3. Change the password to your actual MySQL password:
   ```properties
   spring.datasource.password=YourActualPassword
   ```

4. Save the file (Ctrl + S)

5. Restart Roomify

**Don't remember your MySQL password?**
1. You'll need to reset it using MySQL's password reset procedure
2. Google: "reset MySQL root password Windows"
3. Follow the official MySQL guide

---

### Error 3: "Communications link failure"

**What it means:**  
Roomify can't connect to MySQL because:
- MySQL isn't running, OR
- MySQL is running on a different port, OR
- There's a firewall blocking the connection

**How to fix it:**

**Step 1: Check if MySQL is running**
1. Press `Windows + R`
2. Type: `services.msc` and press Enter
3. Look for "MySQL80" in the list
4. Check if Status says "Running"
   - If not, right-click and select "Start"

**Step 2: Check MySQL port**
1. MySQL usually runs on port 3306
2. Open `src\main\resources\application.properties`
3. Find: `jdbc:mysql://localhost:3306/roomify_dev`
4. Make sure it says `3306` (the default MySQL port)

**Step 3: Test MySQL connection manually**
1. Open Command Prompt
2. Type: `mysql -u root -p`
3. Enter your password
4. If you can log in, MySQL is working!
5. Type `exit` to quit

---

### Error 4: "Table 'roomify_dev.users' doesn't exist"

**What it means:**  
The database tables haven't been created yet.

**How to fix it:**

**This should happen automatically, but if it doesn't:**

1. Check `application.properties`:
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   ```
   Make sure it says `update` (not `none` or `validate`)

2. Restart the application - tables will be created automatically

3. If that doesn't work, create them manually:
   ```bash
   mysql -u root -p
   ```
   Then type:
   ```sql
   USE roomify_dev;
   ```
   Then restart Roomify - it will create the tables

---

### Error 5: "Could not find or load main class"

**What it means:**  
The project hasn't been compiled yet, or the compiled files are corrupted.

**How to fix it:**

1. Open Command Prompt in the project folder

2. Clean and rebuild the project:
   ```bash
   mvnw.cmd clean install
   ```

3. Wait for it to finish (you should see "BUILD SUCCESS")

4. Try starting the app again:
   ```bash
   mvnw.cmd spring-boot:run
   ```

---

### Error 6: "Failed to delete target\roomify-backend-1.0.0.jar"

**What it means:**  
The application is still running, so Maven can't delete the old JAR file.

**How to fix it:**

1. Close any running instances of the application
   - Look for Command Prompt windows running Roomify
   - Press Ctrl+C in those windows

2. If that doesn't work, force stop Java:
   ```bash
   taskkill /F /IM java.exe
   ```

3. Try your command again

---

## 🔍 Debugging Tips

### How to Read Error Messages

Error messages usually have three parts:

1. **Error Type** (at the top):
   ```
   org.springframework.jdbc.CannotGetJdbcConnectionException
   ```
   This tells you what kind of error it is

2. **Error Message** (in the middle):
   ```
   Access denied for user 'root'@'localhost'
   ```
   This tells you what went wrong

3. **Stack Trace** (at the bottom):
   ```
   at com.roomify.RoomifyApplication.main(...)
   ```
   This shows where the error happened (usually not important for beginners)

**Focus on the Error Message** - it usually tells you exactly what's wrong!

---

### Enable Debug Logging

If you need more information:

1. Open `src\main\resources\application.properties`

2. Change logging level:
   ```properties
   logging.level.root=DEBUG
   logging.level.com.roomify=DEBUG
   ```

3. Restart the app - you'll see much more detailed information

4. **Remember to change it back to INFO when you're done!**

---

## 🧪 Testing Your Setup

### Quick Health Check

Run these commands to verify everything:

**1. Check Java:**
```bash
java -version
```
Should show: `java version "17.x.x"`

**2. Check MySQL:**
```bash
mysql --version
```
Should show: `mysql Ver 8.0.x`

**3. Check MySQL Connection:**
```bash
mysql -u root -p
```
Enter your password - if you can log in, MySQL works!

**4. Check if Port 8080 is Free:**
```bash
netstat -ano | findstr :8080
```
Should show nothing (or show Roomify if it's running)

---

## 🆘 Still Having Problems?

### Before Asking for Help

Make sure you've tried:
- [ ] Restarting your computer
- [ ] Checking if MySQL is running
- [ ] Verifying your password in `application.properties`
- [ ] Running `mvnw.cmd clean install`
- [ ] Reading the error message carefully
- [ ] Searching for the error message on Google

### Collect This Information

If you need to ask someone for help, provide:

1. **What you were trying to do**
   - Example: "I was trying to start the application"

2. **What happened instead**
   - Example: "I got an error message"

3. **The exact error message**
   - Copy the entire error from the Command Prompt

4. **Your setup**
   - Windows version
   - Java version (`java -version`)
   - MySQL version (`mysql --version`)

5. **What you've already tried**
   - List the solutions you've attempted

---

## 📚 Helpful Resources

### Official Documentation
- **Spring Boot**: https://spring.io/projects/spring-boot
- **MySQL**: https://dev.mysql.com/doc/
- **Maven**: https://maven.apache.org/guides/

### Community Help
- **Stack Overflow**: https://stackoverflow.com
  - Search for your error message
  - Tag your question with: `spring-boot`, `mysql`, `java`

### Video Tutorials
- Search YouTube for:
  - "Spring Boot tutorial for beginners"
  - "MySQL installation Windows"
  - "How to fix [your specific error]"

---

## ✅ Verification Checklist

Use this checklist to verify your setup:

### Before Starting Roomify
- [ ] Java 17 is installed (`java -version`)
- [ ] MySQL 8 is installed (`mysql --version`)
- [ ] MySQL service is running (check in services.msc)
- [ ] You know your MySQL password
- [ ] Port 8080 is not in use

### Configuration Files
- [ ] `application.properties` has correct MySQL password
- [ ] `application.properties` has correct database URL
- [ ] No syntax errors in `application.properties`

### First Run
- [ ] Run `mvnw.cmd clean install` successfully
- [ ] No errors during compilation
- [ ] Application starts without errors
- [ ] Can access http://localhost:8080/api/actuator/health
- [ ] Health check returns `{"status":"UP"}`

---

## 🎯 Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| Port in use | `taskkill /PID [number] /F` |
| Wrong password | Update `application.properties` |
| MySQL not running | Start MySQL80 service |
| Compilation error | `mvnw.cmd clean install` |
| Tables not created | Check `ddl-auto=update` |
| Can't delete JAR | Stop all Java processes |

---

**Remember: Every developer faces these problems! Don't give up!** 💪

If you fixed a problem not listed here, consider adding it to help others!
