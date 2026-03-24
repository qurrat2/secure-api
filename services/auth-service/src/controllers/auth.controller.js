const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { readUsers, writeUsers } = require("../utils/userStore");
const { validationResult } = require("express-validator");
// TEMP DB (we will replace later with real DB)
const users = [];

exports.register = async (req, res) => {
    const { email, password, role } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const users = readUsers();

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        email,
        password: hashedPassword,
        role: role || "user"
    });
    writeUsers(users);
    res.json({ message: "User registered successfully" });
};

exports.login = async (req, res) => {

    console.log("Login attempt:", req.body.email);

    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Invalid login attempt for:", email);
        return res.status(400).json({ errors: errors.array() });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
        { email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    console.log({
    event: "login_success",
    email,
    timestamp: new Date()
    });
    res.json({ token });
};