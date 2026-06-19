const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FutureSkillFAQ = sequelize.define('FutureSkillFAQ', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('general', 'program', 'implementation', 'assessment', 'partnership'),
    defaultValue: 'general',
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

module.exports = FutureSkillFAQ;
