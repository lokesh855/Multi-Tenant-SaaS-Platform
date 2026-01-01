const { AuditLog } = require("../models");

const logAction = async ({ tenantId, userId, action, entityType, entityId, ipAddress }) => {
  try {
    await AuditLog.create({
      tenantId,
      userId,
      action,
      entityType,
      entityId,
      ipAddress,
    });
  } catch (err) {
    console.error("Audit logging failed", err);
  }
};

module.exports = logAction;
