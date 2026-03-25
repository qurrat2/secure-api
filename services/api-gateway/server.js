const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
app.use(express.json());

// JWT middleware (ZERO TRUST ENTRY)
const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // same secret
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Proxy auth routes
app.use("/api/auth", async (req, res) => {
  try {
    console.log("Forwarding request to:", `http://localhost:3001${req.originalUrl}`);
    const response = await axios({
      method: req.method,
      url: `http://localhost:3001${req.originalUrl}`,
      data: req.body,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json"
      }
    });

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || { message: "Gateway error" });
  }
});

app.get("/api/profile", verifyToken, async (req, res) => {
  res.json({
    message: "Accessed via API Gateway",
    user: req.user
  });
});

app.listen(3000, () => {
  console.log("API Gateway running on port 3000");
});