
# Technical Specification

## 1. Project Structure

This section defines the complete folder structure for both **backend** and **frontend** components of the Multi-Tenant SaaS Platform. The structure follows **industry best practices**, ensuring scalability, maintainability, and clear separation of concerns.

---

## 1.1 Backend Project Structure

```
backend/
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── tenant.controller.js
│   │   ├── user.controller.js
│   │   ├── project.controller.js
│   │   └── task.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── tenant.routes.js
│   │   ├── user.routes.js
│   │   ├── project.routes.js
│   │   └── task.routes.js
│   │
│   ├── models/
│   │   ├── index.js
│   │   ├── tenant.model.js
│   │   ├── user.model.js
│   │   ├── role.model.js
│   │   ├── project.model.js
│   │   ├── task.model.js
│   │
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── tenant.middleware.js
│   │   └── error.middleware.js
│   │   ├── validate.middleware.js
│   │   └── auditlogger.middleware.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │
│   ├── utils/
│   │   ├── apiError.js
│   │   └── runseed.js
│   │
│   ├── config/
│       ├── db.js
│       └── jwt.js
│   
│
├── Dockerfile
├── Migrations
├── Seeders
├── app.js
├── server.js
├── .env
└── package.json
```

### Backend Folder Purpose Explanation

* **controllers/**
  Handles incoming HTTP requests and sends responses. Each controller corresponds to a business module.

* **routes/**
  Defines API endpoints and maps them to controller functions.

* **models/**
  Contains database models and schema definitions for PostgreSQL.

* **middleware/**
  Implements cross-cutting concerns such as authentication, authorization, tenant isolation, and error handling.

* **services/**
  Contains business logic, keeping controllers thin and maintainable.

* **utils/**
  Reusable utility functions like JWT handling, password hashing, and standardized API responses.

* **config/**
  Centralized configuration for database connections, environment variables, and Swagger documentation.

* **migrations/**
  Database migration scripts to manage schema evolution.


---

## 1.2 Frontend Project Structure

```
frontend/
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   └── tasks/
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.service.js
│   │   ├── project.service.js
│   │   └── task.service.js
│   │
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── TenantContext.js
│   │
│   ├── hooks/
│   │   └── useAuth.js
│   │
│   ├── routes/
│   │   └── AppRoutes.js
│   │
│   ├── utils/
│      └── token.util.js
│
├── public/
├── App.jsx
├── main.jsx
├── Dockerfile
├── package.json
└── README.md
```

### Frontend Folder Purpose Explanation

* **components/**
  Reusable UI components shared across the application.

* **pages/**
  Page-level components mapped to routes.

* **services/**
  Handles API calls and backend communication.

* **context/**
  Manages global state such as authentication and tenant data.

* **hooks/**
  Custom React hooks for reusable logic.

* **routes/**
  Centralized routing and role-based route protection.

* **utils/**
  Helper utilities such as token handling.

---

## 2. Development Setup Guide

This section explains how to set up and run the project locally.

---

## 2.1 Prerequisites

Ensure the following tools are installed:

* **Node.js**: v18.x or later
* **npm**: v9.x or later
* **Docker**: v24.x or later
* **Docker Compose**: v2.x
* **PostgreSQL**: v14+ (if running without Docker)
* **Git**

---

## 2.2 Environment Variables

Create a `.env` file inside the backend directory.

```
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=saas_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

```


---

## 2.3 Installation Steps

### Clone Repository

```bash
git clone <repository-url>
cd project-root
```

---

### Backend Setup

```bash
cd backend
npm install
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

---

## 2.4 Running the Application Locally

### Using Docker (Recommended)

```bash
docker-compose up --build
```

This will start:

* Backend API
* Frontend UI
* PostgreSQL database

---

### Without Docker

**Backend**

```bash
cd backend
npm start
```

**Frontend**

```bash
cd frontend
npm run dev
```



