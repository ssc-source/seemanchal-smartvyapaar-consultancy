const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeadAssignment = sequelize.define('LeadAssignment', {
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
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'assigned_to',
  },
  assignedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'assigned_by',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  assignedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'assigned_at',
  },
}, {
  tableName: 'lead_assignments',
  underscored: true,
  timestamps: true,
});

module.exports = LeadAssignment;
