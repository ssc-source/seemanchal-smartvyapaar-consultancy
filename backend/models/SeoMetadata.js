const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SeoMetadata = sequelize.define('SeoMetadata', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  pageKey: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Logical key for the page (e.g. home, about, services/:id)',
  },
  title: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  canonicalUrl: { type: DataTypes.STRING, allowNull: true },
  ogTitle: { type: DataTypes.STRING, allowNull: true },
  ogDescription: { type: DataTypes.TEXT, allowNull: true },
  ogImage: { type: DataTypes.STRING, allowNull: true },
  robots: { type: DataTypes.STRING, allowNull: true },
  structuredData: { type: DataTypes.JSON, allowNull: true },
  status: { type: DataTypes.ENUM('draft', 'published'), allowNull: false, defaultValue: 'published' },
  displayOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, {
  tableName: 'seo_metadata',
  underscored: true,
  timestamps: true,
});

module.exports = SeoMetadata;
