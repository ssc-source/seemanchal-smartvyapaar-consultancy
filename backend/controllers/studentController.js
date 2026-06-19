const catchAsync = require('../utils/catchAsync');
const { StudentProfile, InternshipApplication, InternshipBatch, QuizRegistration, Certificate, QuizAttempt } = require('../models');

exports.me = catchAsync(async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });

  // Locate StudentProfile by userId first, then by registrationId.
  const userId = req.user.id;
  const registrationId = req.user.registrationId || null;
  let student = null;

  if (userId) {
    student = await StudentProfile.findOne({ where: { userId }, include: [{ model: InternshipBatch }] });
  }

  if (!student && registrationId) {
    student = await StudentProfile.findOne({ where: { registrationId }, include: [{ model: InternshipBatch }] });
  }

  if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

  let application = null;
  if (student.applicationId) {
    application = await InternshipApplication.findByPk(student.applicationId);
  }

  if (!application) {
    application = await InternshipApplication.findOne({ where: { studentProfileId: student.id } });
    if (application && !student.applicationId) {
      student.applicationId = application.id;
      await student.save();
    }
  }

  // Recent quiz registrations
  const registrations = await QuizRegistration.findAll({
    where: { studentId: student.id },
    include: [{
      model: QuizAttempt,
      as: 'attempts',
    }],
    order: [['createdAt', 'DESC']],
    limit: 10
  });

  // Sort attempts in-memory by completion date descending
  registrations.forEach(reg => {
    if (reg.attempts) {
      reg.attempts.sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));
    }
  });

  // Certificates
  const certificates = await Certificate.findAll({ where: { studentId: student.id }, order: [['createdAt', 'DESC']], limit: 10 });

  return res.status(200).json({
    success: true,
    data: {
      student: {
        ...student.toJSON(),
        internshipStatus: student.internshipStatus || 'NOT_STARTED',
      },
      application: application
        ? {
            id: application.id,
            applicationId: application.applicationId,
            status: application.status,
            submittedAt: application.createdAt,
          }
        : null,
      registrations,
      certificates,
    },
  });
});

module.exports = exports;
