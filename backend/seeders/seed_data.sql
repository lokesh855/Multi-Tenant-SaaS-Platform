-- =====================================================
-- Seed Data for Multi-Tenant SaaS Application
-- =====================================================

BEGIN;


-- -----------------------------------------------------
-- 1. Sample Tenant: Demo Company
-- -----------------------------------------------------
INSERT INTO tenants (
    id,
    name,
    subdomain,
    status,
    subscription_plan,
    max_users,
    max_projects,
    created_at,
    updated_at
)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Demo Company',
    'demo',
    'active',
    'pro',
    20,
    10,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- 2. Super Admin (No Tenant)
-- -----------------------------------------------------
INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
VALUES (
    uuid_generate_v4(),
    NULL,
    'superadmin@system.com',
    '$2b$10$xfi26Q6SszGCy7dXaw2xR.liSkgnA3l2Xt5Tj54/hStk/VSksM6PG',
    'System Super Admin',
    'super_admin',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- 3. Tenant Admin for Demo Company
-- -----------------------------------------------------
INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'admin@demo.com',
    '$2b$10$srY4JsNN8wj1hxu4Uhu2/efeJg/A0bFoHHeFTou4bTK9RNaRCs5JC',
    'Demo Tenant Admin',
    'tenant_admin',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- 4. Regular Users for Demo Company
-- -----------------------------------------------------
INSERT INTO users (
    id,
    tenant_id,
    email,
    password_hash,
    full_name,
    role,
    is_active,
    created_at,
    updated_at
)
VALUES
(
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'user1@demo.com',
    '$2b$10$KISjEfNyA/YaHWhZLGqk9OCROZEp1z0JiNmFrktiIEdH1d00kLmle',
    'Demo User One',
    'user',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'user2@demo.com',
    '$2b$10$KISjEfNyA/YaHWhZLGqk9OCROZEp1z0JiNmFrktiIEdH1d00kLmle',
    'Demo User Two',
    'user',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- 5. Sample Projects for Demo Company
-- -----------------------------------------------------
INSERT INTO projects (
    id,
    tenant_id,
    name,
    description,
    status,
    created_by,
    created_at,
    updated_at
)
VALUES
(
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Project Alpha',
    'First demo project',
    'active',
    '22222222-2222-2222-2222-222222222222',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Project Beta',
    'Second demo project',
    'active',
    '22222222-2222-2222-2222-222222222222',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- 6. Sample Tasks
-- -----------------------------------------------------
INSERT INTO tasks (
    id,
    project_id,
    tenant_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    created_at,
    updated_at
)
VALUES
(
    uuid_generate_v4(),
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Design UI',
    'Create initial UI designs',
    'todo',
    'high',
    '33333333-3333-3333-3333-333333333333',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    uuid_generate_v4(),
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'Setup Backend',
    'Initialize backend services',
    'in_progress',
    'high',
    '44444444-4444-4444-4444-444444444444',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    uuid_generate_v4(),
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Create Database Schema',
    'Design database tables',
    'completed',
    'medium',
    '33333333-3333-3333-3333-333333333333',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    uuid_generate_v4(),
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'API Integration',
    'Integrate frontend with APIs',
    'todo',
    'medium',
    '44444444-4444-4444-4444-444444444444',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    uuid_generate_v4(),
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'Testing',
    'Perform application testing',
    'todo',
    'low',
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

COMMIT;
