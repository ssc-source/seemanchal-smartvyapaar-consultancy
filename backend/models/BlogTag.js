const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlogTag = sequelize.define('BlogTag', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'blog_tags',
  underscored: true,
  timestamps: true,
});

module.exports = BlogTag;
