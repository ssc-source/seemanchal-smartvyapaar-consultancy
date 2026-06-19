const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  certificateId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'certificate_id',
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  registrationId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'registration_id',
  },
  internshipStudentId: {
    type: DataTypes.UUID,
    allowNull: true,
    unique: true,
    field: 'internship_student_id',
  },
  quizRegistrationId: {
    type: DataTypes.UUID,
    allowNull: true,
    unique: true,
    field: 'quiz_registration_id',
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'student_id',
  },
  certificateType: {
    type: DataTypes.ENUM('Internship', 'Quiz Participation', 'Quiz Merit'),
    allowNull: false,
    field: 'certificate_type',
  },
  pdfUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'pdf_url',
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'verification_code',
  },
  issuedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'issued_at',
  },
}, {
  tableName: 'certificates',
  underscored: true,
  timestamps: true,
});

module.exports = Certificate;
