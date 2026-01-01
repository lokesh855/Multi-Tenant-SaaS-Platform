-- =====================================================
-- Migration: Create audit_logs table
-- Purpose: Track all important actions for security audit
-- =====================================================

-- ---------- UP MIGRATION ----------
BEGIN;

-- Enable UUID extension (required for UUID primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    tenant_id UUID NOT NULL,

    user_id UUID NULL,

    action VARCHAR(100) NOT NULL,

    entity_type VARCHAR(50),

    entity_id VARCHAR(100),

    ip_address VARCHAR(45),

    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_logs_tenant
        FOREIGN KEY (tenant_id)
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_audit_logs_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- Index for tenant-based audit queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id
ON audit_logs(tenant_id);

-- Index for entity-based audit queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity
ON audit_logs(entity_type, entity_id);

COMMIT;

-- ---------- DOWN MIGRATION ----------
BEGIN;

-- Drop audit_logs table
DROP TABLE IF EXISTS audit_logs;

COMMIT;
