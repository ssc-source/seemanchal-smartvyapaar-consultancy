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
  status: { type: DataTypes.ENUM('draft', 'published', 'archived'), defaultValue: 'draft' },
  publishedAt: { type: DataTypes.DATE, allowNull: true },
}, { timestamps: true });

module.exports = BlogPost;
