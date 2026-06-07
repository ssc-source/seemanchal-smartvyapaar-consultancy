const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id',
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entityType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'entity_type',
  },
  entityId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'entity_id',
  },
  oldValue: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'old_value',
  },
  newValue: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'new_value',
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'ip_address',
  },
}, {
  tableName: 'audit_logs',
  underscored: true,
  timestamps: true,
  updatedAt: false,
});

module.exports = AuditLog;
