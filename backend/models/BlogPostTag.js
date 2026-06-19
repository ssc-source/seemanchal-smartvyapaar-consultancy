const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogPostTag = sequelize.define('BlogPostTag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  blogPostId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  blogTagId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  tableName: 'blog_post_tags',
  underscored: true,
  timestamps: true,
  indexes: [
    { unique: true, fields: ['blog_post_id', 'blog_tag_id'] },
  ],
});

module.exports = BlogPostTag;
