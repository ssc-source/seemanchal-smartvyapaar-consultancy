const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InternshipNote = sequelize.define('InternshipNote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'application_id',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id',
  },
  noteType: {
    type: DataTypes.ENUM('INTERNAL', 'FEEDBACK', 'INTERVIEW', 'RESULT', 'GENERAL'),
    allowNull: false,
    defaultValue: 'GENERAL',
    field: 'note_type',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_private',
  },
}, {
  tableName: 'internship_notes',
  underscored: true,
  timestamps: true,
});

module.exports = InternshipNote;
