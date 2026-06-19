const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InternshipBatch = sequelize.define('InternshipBatch', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  program: {
    type: DataTypes.ENUM('Frontend', 'Backend', 'Full Stack'),
    allowNull: false,
  },
  mentorName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'end_date',
  },
  maxStudents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'max_students',
  },
  currentStudents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'current_students',
  },
  status: {
    type: DataTypes.ENUM('UPCOMING', 'ACTIVE', 'COMPLETED'),
    allowNull: false,
    defaultValue: 'UPCOMING',
  },
}, {
  tableName: 'internship_batches',
  underscored: true,
  timestamps: true,
});

module.exports = InternshipBatch;
