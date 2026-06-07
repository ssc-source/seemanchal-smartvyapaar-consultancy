const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentPage = sequelize.define('ContentPage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  seoTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  seoDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'published',
  },
}, {
  tableName: 'content_pages',
  underscored: true,
  timestamps: true,
});

module.exports = ContentPage;
