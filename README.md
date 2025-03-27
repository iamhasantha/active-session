# Active Session Management with Express & Redis

This project implements an **Express.js authentication system** where a user can only be logged in on **one device at a time**. When logging in from a new device, the previous session is invalidated automatically.

---

## Features 🚀
- Enforces **single active session per user**.
- Uses **JWT (JSON Web Token)** for authentication.
- Stores **active session tokens in Redis**.
- **Middleware** to protect routes.
- **Auto logout** from previous devices when logging in from a new one.

---

## Prerequisites 🛠️
- **Node.js** (v14 or higher)
- **Redis** (Installed & running on `localhost:6379`)
- **Postman** or **cURL** for testing (Optional)

---

## Installation 📦

### **1. Clone the Repository**
```sh
git clone https://github.com/your-repo/active-session.git
cd active-session
```

### **2. Install Dependencies**
```sh
npm install
```

### **3. Setup Environment Variables**
Create a `.env` file in the root directory:
```
SECRET_KEY=your_super_secret_key
PORT=3000
```
Generate a secure `SECRET_KEY` using:
```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **4. Start Redis Server** (If not already running)
```sh
redis-server
```

### **5. Run the Application**
```sh
node main.js
```
OR use `nodemon` (auto-restart on file changes):
```sh
npm install -g nodemon
nodemon main.js
```

---

## API Endpoints 📌

### **1. User Login**
```sh
POST /login
```
#### **Request Body:**
```json
{
  "username": "user1",
  "password": "password"
}
```
#### **Response:**
```json
{
  "message": "Login successful",
  "token": "your_jwt_token_here"
}
```
💡 **New login invalidates the previous session.**

---

### **2. Access Protected Route**
```sh
GET /dashboard
```
#### **Headers:**
```json
{
  "Authorization": "Bearer your_jwt_token_here"
}
```
#### **Possible Responses:**
✅ **Valid Token:**
```json
{ "message": "Welcome user 1!" }
```
❌ **Token Invalidated (Logged in from another device):**
```json
{ "message": "Logged out from another device" }
```

---

### **3. Logout**
```sh
POST /logout
```
#### **Headers:**
```json
{
  "Authorization": "Bearer your_jwt_token_here"
}
```
#### **Response:**
```json
{ "message": "Logged out successfully" }
```

---

## Troubleshooting 🛠️
### **Redis Error: Port Already in Use**
```sh
Could not create server TCP listening socket *:6379: bind: Address already in use
```
✅ **Solution:** Check if Redis is already running:
```sh
ps aux | grep redis
```
Then stop the existing process:
```sh
sudo kill -9 <PID>
```
Restart Redis:
```sh
redis-server
```

### **Node.js Syntax Error (`?.` Unexpected Token)**
If you see this error:
```sh
SyntaxError: Unexpected token '.'
```
✅ **Solution:** Update Node.js to v14 or later:
```sh
node -v  # Check version
nvm install 18  # Upgrade using nvm
```
Or modify the code to avoid `?.`:
```javascript
const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
```

---

## License 📜
This project is **open-source** under the MIT License.

---

## Author ✨
Developed by Hasantha - Feel free to contribute!

📧 Contact: mail2hasantha@gmail.com

