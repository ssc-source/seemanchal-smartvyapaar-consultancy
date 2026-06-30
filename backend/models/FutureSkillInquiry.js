const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FutureSkillInquiry = sequelize.define('FutureSkillInquiry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  schoolName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  principalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  boardType: {
    type: DataTypes.ENUM('state_board', 'cbse', 'icse', 'igcse', 'other'),
    allowNull: false,
  },
  studentStrength: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  classesCovered: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of class ranges e.g., ["6-8", "9-12"]',
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('new', 'contacted', 'meeting_scheduled', 'proposal_sent', 'negotiation', 'converted', 'rejected'),
    defaultValue: 'new',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Admin notes for follow-up',
  },
  interestedPrograms: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of interested program types',
  },
  source: {
    type: DataTypes.STRING,
    defaultValue: 'website',
    allowNull: true,
  },
  proposalDownloaded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  proposalDownloadedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  proposalDownloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'future_skill_inquiries',
  underscored: true,
});

module.exports = FutureSkillInquiry;
