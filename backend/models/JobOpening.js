const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobOpening = sequelize.define('JobOpening', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employmentType: {
    type: DataTypes.ENUM('INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT'),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'published',
  },
}, {
  tableName: 'job_openings',
  underscored: true,
  timestamps: true,
});

module.exports = JobOpening;
