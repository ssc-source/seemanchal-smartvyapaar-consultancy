const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FutureSkillProgram = sequelize.define('FutureSkillProgram', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pillar: {
    type: DataTypes.ENUM('ai_literacy', 'digital_citizenship', 'innovation_entrepreneurship', 'career_discovery'),
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Icon name or emoji',
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of key features',
  },
  outcomes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Learning outcomes',
  },
  targetClasses: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of target classes e.g., ["6-8", "9-10", "11-12"]',
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g., "12 sessions" or "24 sessions"',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = FutureSkillProgram;
