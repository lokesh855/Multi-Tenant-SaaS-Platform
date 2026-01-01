-- =====================================================
-- Migration: Create tenants table
-- Purpose: Store organization (tenant) information
-- =====================================================

-- ---------- UP MIGRATION ----------
BEGIN;

-- Enable UUID extension (required for UUID primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- Create ENUM types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tenant_status') THEN
        CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'trial');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan') THEN
        CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');
    END IF;
END$$;

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(255) NOT NULL,

    subdomain VARCHAR(100) NOT NULL UNIQUE,

    status tenant_status NOT NULL DEFAULT 'trial',

    subscription_plan  NOT NULL DEFAULT 'free',

    max_users INTEGER NOT NULL DEFAULT 5,

    max_projects INTEGER NOT NULL DEFAULT 3,

    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster tenant lookup by subdomain
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain
ON tenants(subdomain);

COMMIT;

-- ---------- DOWN MIGRATION ----------
BEGIN;

-- Drop table first (dependent objects removed automatically)
DROP TABLE IF EXISTS tenants;

-- Drop ENUM types
DROP TYPE IF EXISTS tenant_status;
DROP TYPE IF EXISTS subscription_plan;

COMMIT;
