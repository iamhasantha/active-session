require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const redis = require("redis");

const app = express();
const port = 3000;
app.use(express.json());

// Redis client setup
const redisClient = redis.createClient();
redisClient.connect();

// Mock user database
const users = [{ id: "1", username: "user1", password: bcrypt.hashSync("password", 10) }];

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

// Login Route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a new token
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "20s" });

    // Store token in Redis, replacing any existing session
    await redisClient.set(user.id, token);

    res.json({ message: "Login successful", token });
});

// Middleware to protect routes
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const storedToken = await redisClient.get(decoded.id);

        if (storedToken !== token) {
            return res.status(401).json({ message: "Logged out from another device" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

// Protected Route Example
app.get("/dashboard", authenticate, (req, res) => {
    res.json({ message: `Welcome user ${req.user.id}!` });
});

// Logout Route
app.post("/logout", authenticate, async (req, res) => {
    await redisClient.del(req.user.id);
    res.json({ message: "Logged out successfully" });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
