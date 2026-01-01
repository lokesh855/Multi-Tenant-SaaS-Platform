-- =====================================================
-- Migration: Create users table
-- Purpose: Store user accounts with tenant association
-- =====================================================

-- ---------- UP MIGRATION ----------
BEGIN;

-- Enable UUID extension (required for UUID primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create ENUM for user roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('super_admin', 'tenant_admin', 'user');
    END IF;
END$$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    tenant_id UUID NOT NULL,

    email VARCHAR(255) NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    full_name VARCHAR(255) NOT NULL,

    role user_role NOT NULL DEFAULT 'user',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_email_per_tenant
        UNIQUE (tenant_id, email)
);

-- Index for tenant-based queries
CREATE INDEX IF NOT EXISTS idx_users_tenant_id
ON users(tenant_id);

-- Index for login performance
CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

COMMIT;

-- ---------- DOWN MIGRATION ----------
BEGIN;

-- Drop users table first
DROP TABLE IF EXISTS users;

-- Drop ENUM type
DROP TYPE IF EXISTS user_role;

COMMIT;
