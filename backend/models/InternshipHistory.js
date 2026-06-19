const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InternshipHistory = sequelize.define('InternshipHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'application_id',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id',
  },
  previousStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'previous_status',
  },
  newStatus: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'new_status',
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'internship_histories',
  underscored: true,
  timestamps: true,
});

module.exports = InternshipHistory;
