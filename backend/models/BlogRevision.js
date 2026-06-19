const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogRevision = sequelize.define('BlogRevision', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  blogPostId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  excerpt: { type: DataTypes.TEXT, allowNull: true },
  featuredImage: { type: DataTypes.STRING, allowNull: true },
  authorName: { type: DataTypes.STRING, allowNull: true },
  authorImage: { type: DataTypes.STRING, allowNull: true },
  status: { type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'), allowNull: false, defaultValue: 'DRAFT' },
  publishedAt: { type: DataTypes.DATE, allowNull: true },
  seoMetadataId: { type: DataTypes.UUID, allowNull: true },
  categoryId: { type: DataTypes.UUID, allowNull: true },
  blogCategoryId: { type: DataTypes.UUID, allowNull: true },
  tagSnapshot: { type: DataTypes.JSON, allowNull: true },
  metaTitle: { type: DataTypes.STRING, allowNull: true },
  metaDescription: { type: DataTypes.TEXT, allowNull: true },
  canonicalUrl: { type: DataTypes.STRING, allowNull: true },
  ogImage: { type: DataTypes.STRING, allowNull: true },
  twitterCard: { type: DataTypes.STRING, allowNull: true },
  readingTime: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'blog_revisions',
  underscored: true,
  timestamps: true,
});

module.exports = BlogRevision;
