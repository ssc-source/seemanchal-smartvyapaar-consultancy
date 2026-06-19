const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FutureSkillTestimonial = sequelize.define('FutureSkillTestimonial', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  testimonialText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  programsUsed: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of programs they used',
  },
  impactMetrics: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Student engagement, satisfaction scores, etc.',
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL to person/school image',
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 5,
    validate: { min: 1, max: 5 },
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
});

module.exports = FutureSkillTestimonial;
