const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogPost = sequelize.define('BlogPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  content: { type: DataTypes.TEXT, allowNull: false }, // Store HTML or Markdown
  excerpt: { type: DataTypes.TEXT, allowNull: true },
  featuredImage: { type: DataTypes.STRING, allowNull: true },
  authorName: { type: DataTypes.STRING, allowNull: true },
  authorImage: { type: DataTypes.STRING, allowNull: true },
  authorId: { type: DataTypes.UUID, allowNull: true },
  seoMetadataId: { type: DataTypes.UUID, allowNull: true },
  categoryId: { type: DataTypes.UUID, allowNull: true },
  blogCategoryId: { type: DataTypes.UUID, allowNull: true },
  status: { type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'), allowNull: false, defaultValue: 'DRAFT' },
  publishedAt: { type: DataTypes.DATE, allowNull: true },
  metaTitle: { type: DataTypes.STRING, allowNull: true },
  metaDescription: { type: DataTypes.TEXT, allowNull: true },
  canonicalUrl: { type: DataTypes.STRING, allowNull: true },
  ogImage: { type: DataTypes.STRING, allowNull: true },
  twitterCard: { type: DataTypes.STRING, allowNull: true },
  readingTime: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'blog_posts',
  underscored: true,
  timestamps: true,
});

module.exports = BlogPost;
