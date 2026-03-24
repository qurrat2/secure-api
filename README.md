# Secure Zero Trust Authentication Platform

A backend authentication system built with **Node.js + Express**, implementing real-world security practices inspired by Zero Trust architecture.

---

##  Features

- User Registration & Login (JWT Authentication)
- Role-Based Access Control (RBAC)
- Rate Limiting (Brute-force protection)
- Request Logging (Morgan + custom logs)
- Centralized Error Handling
- Secure API design principles

---

##  Tech Stack

- Node.js
- Express.js
- JSON Web Token (JWT)
- Express Rate Limit
- Morgan (Logging)

---

##  Security Features Implemented

-  JWT-based authentication
-  RBAC (Admin/User roles)
-  Rate limiting on login endpoint
-  Request logging for audit tracking
-  Centralized error handling middleware

---

##  Project Structure
services/
└── auth-service/
├── controllers/
├── routes/
├── middleware/
├── app.js

# API Testing
 Use postman or curl:
 ## Register 
 POST /api/auth/register
 ## Login
 POST /api/auth/login
 ## Protected route
 Get /profile
 Authorization: Bearer <token>


## Docker (optional next step)

```bash
docker build -t auth-service .
docker run -p 3001:3001 auth-service

