const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeadNote = sequelize.define('LeadNote', {
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
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id',
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'lead_notes',
  underscored: true,
  timestamps: true,
});

module.exports = LeadNote;
