const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false, field: 'password_hash' },
  role: { type: DataTypes.ENUM('admin', 'editor'), defaultValue: 'editor' },
  status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), allowNull: false, defaultValue: 'ACTIVE' },
  lastLogin: { type: DataTypes.DATE, allowNull: true, field: 'last_login' },
  passwordChangedAt: { type: DataTypes.DATE, allowNull: true, field: 'password_changed_at' },
  roleId: { type: DataTypes.UUID, allowNull: true, field: 'role_id' },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
