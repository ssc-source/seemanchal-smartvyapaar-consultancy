const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Media = sequelize.define('Media', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER, // File size in bytes
    allowNull: false,
  },
  path: {
    type: DataTypes.STRING, // URL or relative path
    allowNull: false,
  },
  altText: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  uploadedBy: {
    type: DataTypes.UUID, // Refers to Admin/User ID
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'url',
  },
  publicId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'public_id',
  },
  storageProvider: {
    type: DataTypes.ENUM('local', 'cloudinary'),
    allowNull: false,
    defaultValue: 'local',
    field: 'storage_provider',
  },
  folder: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'folder',
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'width',
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'height',
  }
}, {
  tableName: 'media',
  timestamps: true,
});

module.exports = Media;
