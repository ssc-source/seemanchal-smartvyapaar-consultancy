const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommunityItem = sequelize.define('CommunityItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('GROUP', 'EVENT', 'MEETUP', 'WORKSHOP', 'WEBINAR'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
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
  tableName: 'community_items',
  underscored: true,
  timestamps: true,
});

module.exports = CommunityItem;
