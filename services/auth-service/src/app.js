const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const auth = require("./middleware/auth");
const role = require("./middleware/role");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false, // avoid blocking API responses
  })); // security headers (OWASP baseline)


const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: "Too many requests, please try again later"
});

app.use(globalLimiter);

app.use("/api/auth", authRoutes);

app.get("/profile", auth, (req, res) => {
  res.json({
    message: "Protected data accessed",
    user: req.user
  });
});

app.get("/admin", auth, role("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

app.get("/dashboard", auth, role("admin", "user"), (req, res) => {
  res.json({ message: "Dashboard access granted" });
});

app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);

  res.status(500).json({
    message: "Internal Server Error"
  });
});

module.exports = app;