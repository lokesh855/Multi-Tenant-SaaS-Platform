##### API Documentation

## Multi-Tenant SaaS Platform

Base URL: http://localhost:5000/api

Authentication

JWT-based authentication

Token must be sent in header:

Authorization: Bearer <JWT_TOKEN>



## 1. Tenant Registration

Method : POST
Endpoint: /auth/register-tenant
Auth Required: No

Request Body:

{
  "tenantName": "Test Company Alpha",
  "subdomain": "testalpha",
  "adminEmail": "admin@testalpha.com",
  "adminPassword": "TestPass@123",
  "adminFullName": "Alpha Admin"
}


Success Response:

{
  "success": true,
  "message": "Tenant registered successfully",
  "data": {
    "tenantId": "uuid",
    "subdomain": "value",
    "adminUser": {
      "id": "uuid",
      "email": "value",
      "fullName": "value",
      "role": "tenant_admin"
    }
  }
}

----------------------------------------------------------------

## 2. Login

Method: POST
Endpoint: /auth/login
Auth Required: No


Request Body:

{
  "email": "admin@demo.com",
  "password": "Demo@123",
  "tenantSubdomain": "demo"
}


Success Response:

{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "value",
      "fullName": "value",
      "role": "tenant_admin",
      "tenantId": "uuid"
    },
    "token": "jwt-token-string",
    "expiresIn": 86400
  }
}

----------------------------------------------------

## 3. Get Current User

Method: GET
Endpoint: /auth/me
Auth Required: Yes

Success Response:

{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "value",
    "fullName": "value",
    "role": "tenant_admin",
    "isActive": true,
    "tenant": {
      "id": "uuid",
      "name": "value",
      "subdomain": "value",
      "subscriptionPlan": "pro",
      "maxUsers": 10,
      "maxProjects": 20
    }
  }
}

--------------------------------------------------------

## 4. Logout

Method: POST
Endpoint: /auth/logout
Auth Required: Yes

Success Response:

{
  "success": true,
  "message": "Logged out successfully"
}

---------------------------------------------------------------

## 5. Get Tenant Details

Method: GET
Endpoint: /tenants/:tenantId
Auth Required: Yes

Success Response:

{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "value",
    "subdomain": "value",
    "status": "active",
    "subscriptionPlan": "pro",
    "maxUsers": 10,
    "maxProjects": 20,
    "createdAt": "timestamp",
    "stats": {
      "totalUsers": 5,
      "totalProjects": 3,
      "totalTasks": 15
    }
  }
}

---------------------------------------------------------------

## 6. Update Tenant

Method: PUT
Endpoint: /tenants/:tenantId
Auth Required: Yes

Request Body:

{
  "name": "Updated Company Name"
}

Success Response:

{
  "success": true,
  "message": "Tenant updated successfully",
  "data": {
    "id": "uuid",
    "name": "updated-value",
    "updatedAt": "timestamp"
  }
}

---------------------------------------------------------

## 7. List All Tenants

Method: GET
Endpoint: /tenants
Auth Required: Yes


Success Response:

{
  "success": true,
  "data": {
    "tenants": [
      {
        "id": "uuid",
        "name": "value",
        "subdomain": "value",
        "status": "active",
        "subscriptionPlan": "pro",
        "totalUsers": 5,
        "totalProjects": 3,
        "createdAt": "timestamp"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalTenants": 47,
      "limit": 10
    }
  }
}

-------------------------------------------------------------

## 8. Add User to Tenant

Method: POST
Endpoint: /tenants/:tenantId/users
Auth Required: Yes

Request Body:

{
  "email": "newuser@demo.com",
  "password": "NewUser@123",
  "fullName": "New User",
  "role": "user"
}


Success Response:

{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "email": "value",
    "fullName": "value",
    "role": "user",
    "tenantId": "uuid",
    "isActive": true,
    "createdAt": "timestamp"
  }
}

-----------------------------------------------------------------

## 9. List Tenant Users

Method: GET
Endpoint: /tenants/:tenantId/users
Auth Required: Yes

Success Response:

{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "email": "value",
        "fullName": "value",
        "role": "tenant_admin",
        "isActive": true,
        "createdAt": "timestamp"
      }
    ],
    "total": 5,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 50
    }
  }
}

--------------------------------------------------------------------

## 10. Update User

Method: PUT
Endpoint: /users/:userId
Auth Required: Yes

Request Body:

{
  "fullName": "Pavan",
  "role":"tenant_admin",
  "isActive":"true"
}

Success Response:

{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "fullName": "updated-value",
    "role": "user",
    "updatedAt": "timestamp"
  }
}

----------------------------------------------------------------------

## 11. Delete User

Method: DELETE
Endpoint: /users/:userId
Auth Required: Yes


Success Response:

{
  "success": true,
  "message": "User deleted successfully"
}

----------------------------------------------------------------------

## 12. Create Project

Method: POST
Endpoint: /projects
Auth Required: Yes

Request Body:

{
  "name": "Website Redesign Project",
  "description": "Complete redesign of company website",
  "status":"active"
}


Success Response:

{
  "success": true,
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "value",
    "description": "value",
    "status": "active",
    "createdBy": "uuid",
    "createdAt": "timestamp"
  }
}

------------------------------------------------------------

## 13. List Projects

Method: GET
Endpoint: /projects
Auth Required: Yes


Success Response:

{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "value",
        "description": "value",
        "status": "active",
        "createdBy": {
          "id": "uuid",
          "fullName": "value"
        },
        "taskCount": 5,
        "completedTaskCount": 2,
        "createdAt": "timestamp"
      }
    ],
    "total": 3,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 20
    }
  }
}

----------------------------------------------------------------

## 14. Update Project

Method: PUT
Endpoint: /projects/:projectId
Auth Required: Yes

Request Body:

{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "archived"
}


Success Response:

{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "uuid",
    "name": "updated-value",
    "description": "updated-value",
    "status": "active",
    "updatedAt": "timestamp"
  }
}

------------------------------------------------------------------

## 15. Delete Project

Method: DELETE
Endpoint: /projects/:projectId
Auth Required: Yes


Success Response:

{
  "success": true,
  "message": "Project deleted successfully"
}

-------------------------------------------------------------------

## 16. Create Task

Method: POST
Endpoint: /projects/:projectId/tasks
Auth Required: Yes

Request Body:

{
  "title": "Design homepage mockup",
  "description": "Create high-fidelity design",
  "assignedTo": "user-uuid-here",
  "priority": "high",
  "dueDate": "2024-07-15"
}

Success Response:

{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "tenantId": "uuid",
    "title": "value",
    "description": "value",
    "status": "todo",
    "priority": "high",
    "assignedTo": "uuid",
    "dueDate": "2024-07-01",
    "createdAt": "timestamp"
  }
}

-----------------------------------------------------------------------

## 17. List Project Tasks

Method: GET
Endpoint: /projects/:projectId/tasks
Auth Required: Yes

Success Response:

{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "value",
        "description": "value",
        "status": "in_progress",
        "priority": "high",
        "assignedTo": {
          "id": "uuid",
          "fullName": "value",
          "email": "value"
        },
        "dueDate": "2024-07-01",
        "createdAt": "timestamp"
      }
    ],
    "total": 5,
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "limit": 50
    }
  }
}

--------------------------------------------------------------

## 18. Update Task Status

Method: PATCH
Endpoint: /tasks/:taskId/status
Auth Required: Yes

Success Response:

{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "completed",
    "updatedAt": "timestamp"
  }
}

---------------------------------------------------

## 19. Update Task

Method: PUT
Endpoint: /tasks/:taskId
Auth Required: Yes

Request Body:

{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "high",
  "assignedTo": "user-uuid-here",
  "dueDate": "2024-08-01"
}


Success Response:

{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "uuid",
    "title": "updated-value",
    "description": "updated-value",
    "status": "in_progress",
    "priority": "high",
    "assignedTo": {
      "id": "uuid",
      "fullName": "value",
      "email": "value"
    },
    "dueDate": "2024-07-20",
    "updatedAt": "timestamp"
  }
}

