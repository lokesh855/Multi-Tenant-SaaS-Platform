-- =====================================================
-- Migration: Create tasks table
-- Purpose: Store tasks within projects
-- =====================================================

-- ---------- UP MIGRATION ----------
BEGIN;

-- Enable UUID extension (required for UUID primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create ENUM for task status and priority
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
        CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
    END IF;
END$$;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    project_id UUID NOT NULL,

    tenant_id UUID NOT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    status task_status NOT NULL DEFAULT 'todo',

    priority task_priority NOT NULL DEFAULT 'medium',

    assigned_to UUID NULL,

    due_date DATE NULL,

    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_tasks_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tasks_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tasks_assigned_to
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Composite index for tenant + project filtering
CREATE INDEX IF NOT EXISTS idx_tasks_tenant_project
ON tasks(tenant_id, project_id);

-- Index for assigned user lookup
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to
ON tasks(assigned_to);

COMMIT;

-- ---------- DOWN MIGRATION ----------
BEGIN;

-- Drop tasks table first
DROP TABLE IF EXISTS tasks;

-- Drop ENUM types
DROP TYPE IF EXISTS task_status;
DROP TYPE IF EXISTS task_priority;

COMMIT;
