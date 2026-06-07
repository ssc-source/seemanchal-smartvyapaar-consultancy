const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolePermission = sequelize.define('RolePermission', {
  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'role_id',
  },
  permissionId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'permission_id',
  },
}, {
  tableName: 'role_permissions',
  underscored: true,
  timestamps: false,
});

module.exports = RolePermission;
