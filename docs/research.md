
# Research Document

**Multi-Tenant SaaS Platform with Project & Task Management**

---

## 1. Multi-Tenancy Analysis

Multi-tenancy is a core architectural requirement of modern SaaS platforms. It allows multiple organizations (tenants) to share the same application infrastructure while ensuring strict data isolation, security, and performance. Choosing the right multi-tenancy strategy directly impacts scalability, cost, maintainability, and security.

This section compares three commonly used multi-tenancy approaches and justifies the chosen model for this project.

---

### 1.1 Multi-Tenancy Approaches Comparison

| Approach                              | Description                                                                                  | Pros                                                                    | Cons                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Shared Database + Shared Schema**   | All tenants share the same database and tables. Data is isolated using a `tenant_id` column. | Lowest cost, easy to scale, simple deployment, efficient resource usage | Risk of data leakage if tenant isolation is poorly implemented |
| **Shared Database + Separate Schema** | Single database, but each tenant has its own schema                                          | Better isolation than shared schema, easier per-tenant customization    | Schema management complexity, harder migrations                |
| **Separate Database per Tenant**      | Each tenant has a dedicated database                                                         | Strongest isolation, high security, easy tenant-level backup            | High cost, poor scalability, operational overhead              |


### 1.2 Chosen Approach: Shared Database + Shared Schema

This project adopts the **Shared Database + Shared Schema** approach using a mandatory `tenant_id` column.

#### Justification

This approach is best suited for a **production-ready SaaS platform** targeting scalability and cost efficiency. Since the system is designed to handle multiple tenants dynamically, using a single schema avoids database explosion and simplifies deployment.

Data isolation is enforced at:

* **Authentication level** (tenant extracted from JWT)
* **Middleware level** (automatic query scoping)
* **Database level** (foreign keys, indexes, constraints)

With proper backend enforcement and strict query scoping, this model provides strong logical isolation while maintaining excellent scalability.

This approach is widely used by successful SaaS products such as **Slack, Trello, and Notion**, making it a proven industry-standard solution.

---

## 2. Technology Stack Justification

Choosing the right technology stack is critical to ensure scalability, maintainability, developer productivity, and long-term support.

---

### 2.1 Backend Framework: Node.js + Express.js

**Why chosen:**

* Non-blocking, event-driven architecture ideal for I/O-heavy applications
* Excellent performance for REST APIs
* Large ecosystem and community support
* Simple middleware-based design ideal for authentication and tenant isolation

**Alternatives considered:**

* Spring Boot (Java) – heavier setup, slower iteration
* Django (Python) – less flexible for fine-grained middleware control

---

### 2.2 Frontend Framework: React

**Why chosen:**

* Component-based architecture
* Excellent ecosystem
* Fast rendering with virtual DOM
* Easy role-based UI rendering
* Industry standard for modern SaaS dashboards

**Alternatives considered:**

* Angular – steeper learning curve
* Vue.js – smaller ecosystem for enterprise SaaS

---

### 2.3 Database: PostgreSQL

**Why chosen:**

* Strong ACID compliance
* Advanced indexing
* Excellent relational modeling
* JSON support for flexible data
* Reliable performance for multi-tenant workloads

**Alternatives considered:**

* MySQL – fewer advanced features
* MongoDB – weaker relational guarantees

---

### 2.4 Authentication Method: JWT + bcrypt

**Why chosen:**

* Stateless authentication suitable for horizontal scaling
* JWT allows embedding tenant and role information
* bcrypt provides secure password hashing with salt

**Alternatives considered:**

* Session-based auth – poor scalability
* OAuth-only approach – unnecessary complexity for this scope

---

### 2.5 Deployment Platform: Docker + Docker Compose

**Why chosen:**

* Consistent environment across systems
* Easy service orchestration
* One-command deployment
* Industry-standard containerization

**Alternatives considered:**

* Manual server setup – error-prone
* Kubernetes – overkill for this assignment

---

## 3. Security Considerations

Security is a critical requirement for any multi-tenant SaaS application. A breach in one tenant must never affect others.

---

### 3.1 Key Security Measures

1. **Strict Tenant Isolation**

   * Every request is scoped using `tenant_id` from JWT
   * Client-provided tenant data is ignored

2. **JWT-Based Authentication**

   * 24-hour token expiration
   * Signed tokens prevent tampering

3. **Role-Based Access Control (RBAC)**

   * API-level authorization
   * Roles: Super Admin, Tenant Admin, User

4. **Password Hashing**

   * bcrypt with salting
   * No plaintext password storage

5. **Audit Logging**

   * All critical actions recorded
   * Enables traceability and incident analysis

---

### 3.2 Data Isolation Strategy

* `tenant_id` is mandatory in all tenant-scoped tables
* Middleware enforces automatic query filtering
* Database indexes ensure performance
* Super Admin users are the only exception (tenant_id = NULL)

---

### 3.3 Authentication & Authorization Approach

* JWT contains `user_id`, `tenant_id`, and `role`
* Authorization middleware checks permissions before controller execution
* Unauthorized access results in `401` or `403`

---

### 3.4 API Security Measures

* Parameterized queries to prevent SQL injection
* Proper HTTP status codes
* Input validation
* CORS configuration restricted to frontend service
* No sensitive data in API responses

---

## Conclusion

This research establishes a **secure, scalable, and industry-aligned foundation** for building a production-ready multi-tenant SaaS platform. The selected architecture and technologies balance performance, cost, and maintainability while adhering to real-world SaaS standards.

---

