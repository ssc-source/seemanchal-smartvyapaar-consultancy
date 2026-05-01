const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
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
  clientName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Phase 7 case-study fields
  businessType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  problem: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  solution: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  outcome: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tools: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  featuredImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  href: {
  type: DataTypes.STRING,
  allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true,
});

module.exports = Project;
