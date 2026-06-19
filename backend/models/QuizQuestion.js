const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizQuestion = sequelize.define('QuizQuestion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quizExamId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'quiz_exam_id',
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'question_text',
  },
  questionType: {
    type: DataTypes.ENUM('single_choice', 'multiple_choice', 'text'),
    allowNull: false,
    defaultValue: 'single_choice',
    field: 'question_type',
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  correctAnswer: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'correct_answer',
  },
  marks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'quiz_questions',
  underscored: true,
  timestamps: true,
});

module.exports = QuizQuestion;
