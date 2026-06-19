const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StudentProfile = sequelize.define('StudentProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  applicationId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'application_id',
  },
  batchId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'batch_id',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'dob',
  },
  registrationId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'registration_id',
  },
  college: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  track: {
    type: DataTypes.ENUM('Frontend', 'Backend', 'Full Stack', 'UI/UX', 'AI'),
    allowNull: true,
  },
  internshipStatus: {
    type: DataTypes.ENUM('NOT_STARTED', 'APPLIED', 'IN_PROGRESS', 'COMPLETED'),
    allowNull: false,
    defaultValue: 'NOT_STARTED',
    field: 'internship_status',
  },
  week1Status: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'week1_status',
  },
  week2Status: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'week2_status',
  },
  week3Status: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'week3_status',
  },
  week4Status: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'week4_status',
  },
  week5Status: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'week5_status',
  },
  week6Status: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'week6_status',
  },
  mentorRemarks: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'mentor_remarks',
  },
  certificateIssued: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'certificate_issued',
  },
  quizEligible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'quiz_eligible',
  },
  assessmentPassed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'assessment_passed',
  },
  assessmentScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'assessment_score',
  },
}, {
  tableName: 'student_profiles',
  underscored: true,
  timestamps: true,
});

module.exports = StudentProfile;
