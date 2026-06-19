const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FutureSkillSuccessStory = sequelize.define('FutureSkillSuccessStory', {
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
  schoolName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Short summary of the success story',
  },
  fullStory: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Detailed narrative',
  },
  programs: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Programs implemented',
  },
  outcomes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Quantified outcomes/impacts',
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Featured image URL',
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: true,
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

module.exports = FutureSkillSuccessStory;
