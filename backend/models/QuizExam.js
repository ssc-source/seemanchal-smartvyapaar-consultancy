const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizExam = sequelize.define('QuizExam', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  passMarks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'pass_marks',
  },
  type: {
    type: DataTypes.ENUM('INTERNSHIP_ASSESSMENT', 'PRACTICE_TEST', 'CERTIFICATION_TEST'),
    allowNull: false,
    defaultValue: 'PRACTICE_TEST',
  },
  timeLimitMinutes: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'time_limit_minutes',
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'draft',
  },
}, {
  tableName: 'quiz_exams',
  underscored: true,
  timestamps: true,
});

module.exports = QuizExam;
