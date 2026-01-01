### Multi-Tenant SaaS Platform

1. Project Title and Description

Multi-Tenant SaaS Platform is a full-stack web application designed to support multiple tenants (organizations) within a single system while ensuring data isolation and secure access. The platform provides authentication, role-based access, and tenant-aware APIs.
Target Audience: SaaS startups, developers learning multi-tenant architectures, and academic final-year projects.


---

2. Features List

Multi-tenant architecture with tenant-level data isolation

Secure user authentication using JWT

Role-based access control (Admin, User)

Tenant onboarding and management

RESTful API design

Database migrations and seed management

Dockerized backend, frontend, and database

Environment-based configuration (.env support)

Health check API for backend monitoring



---

3. Technology Stack

Frontend

React.js 18

Vite 5.x

Axios 1.x

HTML5, CSS3


Backend

Node.js 18.x

Express.js 4.x

Sequelize ORM 6.x

JWT (jsonwebtoken)


Database

PostgreSQL 14+


Containerization

Docker

Docker Compose



---

4. Architecture Overview

The system follows a client-server architecture with containerized services. The frontend communicates with the backend via REST APIs. The backend handles authentication, tenant logic, and database interactions. PostgreSQL is used as the primary data store, and Docker Compose orchestrates all services.

Architecture Flow: Frontend (React) → Backend API (Node.js + Express) → PostgreSQL Database

> Architecture diagram is included as an image in the /docs folder.




---

5. Installation & Setup

Prerequisites

Node.js 18+

Docker & Docker Compose

Git


Step-by-Step Setup

1. Clone the repository

git clone <repository-url>
cd Multi-Tenant-SaaS-Platform

2. Environment setup

Create .env files in both backend and frontend folders using .env.example as reference.

3. Run using Docker

docker compose build
docker compose up


4. Access applications

Frontend: http://localhost:3000

Backend API: http://localhost:5000



---

6. Environment Variables

Backend (.env)

PORT – Backend server port

DATABASE_URL – PostgreSQL connection string

JWT_SECRET – Secret key for JWT signing

JWT_EXPIRES_IN – Token expiration time



---

7. API Documentation

Authentication

POST /api/auth/login – User login

POST /api/auth/register – User registration


Tenant Management

GET /api/tenants – List tenants

POST /api/tenants – Create tenant


Health Check

GET /api/health – Backend health status


You can overview all the API endpoints in this path file docs/API.md