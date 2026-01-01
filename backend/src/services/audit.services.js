const { AuditLog } = require("../models");

/**
 * Create an audit log entry
 * @param {Object} params
 * @param {string} params.tenantId
 * @param {string} params.userId
 * @param {string} params.action
 * @param {string|null} params.entityType
 * @param {string|null} params.entityId
 * @param {string|null} params.ipAddress
 * @param {Object|null} params.details
 */
const auditLog = async ({
  tenantId,
  userId,
  action,
  entityType = null,
  entityId = null,
  ipAddress = null,
  details = null,
}) => {
  return await AuditLog.create({
    tenantId,
    userId,
    action,
    entityType,
    entityId,
    ipAddress,
    details: details ? JSON.stringify(details) : null,
  });
};

module.exports = auditLog;