const { AuditLog } = require('../models');

exports.recordAudit = async ({ userId, action, entityType, entityId, oldValue, newValue, ipAddress }) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      oldValue,
      newValue,
      ipAddress,
    });
  } catch (error) {
    console.warn('Audit logger failed:', error.message || error);
  }
};
