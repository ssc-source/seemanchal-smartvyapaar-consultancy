const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InternshipApplication = sequelize.define('InternshipApplication', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  applicationId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  registrationId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'registration_id',
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id',
  },
  studentProfileId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'student_profile_id',
  },
  college: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  degree: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  graduationYear: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'graduation_year',
  },
  applyingFor: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'applying_for',
  },
  internshipType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'internship_type',
  },
  github: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  portfolio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  projectsExperience: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'projects_experience',
  },
  whyJoinSSC: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'why_join_ssc',
  },
  branch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  internshipTrack: {
    type: DataTypes.ENUM('Frontend', 'Backend', 'Full Stack', 'UI/UX', 'AI'),
    allowNull: false,
  },
  // Deprecated resume fields: no longer required by the public internship form.
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resumeFileName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resumeMimeType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resumeSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED', 'ONBOARDED', 'COMPLETED'),
    allowNull: false,
    defaultValue: 'APPLIED',
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  assignedBatchId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'assigned_batch_id',
  },
}, {
  tableName: 'internship_applications',
  underscored: true,
  timestamps: true,
});

module.exports = InternshipApplication;
