const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/auth.controller");
const { body, validationResult } = require("express-validator");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 5, // max 5 attempts
  message: {
    message: "Too many login attempts. Please try again later."
  }
});

router.post("/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["admin", "user"])
      .withMessage("Invalid role"),
  ], authController.register);

// Apply rate limiter to login route
router.post("/login", loginLimiter, [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password required"),
  ], authController.login);

module.exports = router;