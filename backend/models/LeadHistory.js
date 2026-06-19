const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeadHistory = sequelize.define('LeadHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  leadId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'lead_id',
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
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
  actorId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'actor_id',
  },
}, {
  tableName: 'lead_histories',
  underscored: true,
  timestamps: true,
});

module.exports = LeadHistory;
