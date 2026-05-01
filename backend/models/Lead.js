const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  serviceOfInterest: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'qualified', 'closed', 'lost'),
    defaultValue: 'new',
  },
  // Lead Source Tracking Fields
  source: {
    type: DataTypes.STRING, // e.g., 'organic', 'google_ads', 'facebook_ads', 'referral', 'direct'
    allowNull: true,
    defaultValue: 'direct'
  },
  campaign: {
    type: DataTypes.STRING, // utm_campaign
    allowNull: true,
  },
  medium: {
    type: DataTypes.STRING, // utm_medium
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT, // Admin notes for CRM
    allowNull: true,
  }
}, {
  timestamps: true,
});

module.exports = Lead;
