-- =====================================================
-- Migration: Create projects table
-- Purpose: Store projects for each tenant
-- =====================================================

-- ---------- UP MIGRATION ----------
BEGIN;

-- Enable UUID extension (required for UUID primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create ENUM for project status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('active', 'archived', 'completed');
    END IF;
END$$;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    tenant_id UUID NOT NULL,

    name VARCHAR(255) NOT NULL,

    description TEXT,

    status project_status NOT NULL DEFAULT 'active',

    created_by UUID NOT NULL,

    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_projects_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_projects_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Index for tenant-based queries
CREATE INDEX IF NOT EXISTS idx_projects_tenant_id
ON projects(tenant_id);

-- Index for creator-based queries
CREATE INDEX IF NOT EXISTS idx_projects_created_by
ON projects(created_by);

COMMIT;

-- ---------- DOWN MIGRATION ----------
BEGIN;

-- Drop projects table first
DROP TABLE IF EXISTS projects;

-- Drop ENUM type
DROP TYPE IF EXISTS project_status;

COMMIT;
