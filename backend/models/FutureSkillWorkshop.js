const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FutureSkillWorkshop = sequelize.define('FutureSkillWorkshop', {
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
    allowNull: true,
  },
  programId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'FutureSkillPrograms',
      key: 'id',
    },
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g., "2 hours", "Full day"',
  },
  format: {
    type: DataTypes.ENUM('in_person', 'online', 'hybrid'),
    defaultValue: 'hybrid',
  },
  targetAudience: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Classes and roles',
  },
  agenda: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of agenda items with timings',
  },
  deliverables: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'What participants will receive/learn',
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

module.exports = FutureSkillWorkshop;
