const { Op } = require('sequelize');
const { InternshipApplication, InternshipHistory, StudentProfile } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');
const { sendBatchAssignmentNotification, sendInternshipStatusUpdate } = require('../utils/email');
const internshipController = require('./internshipController');

const safeProfileTrack = (track) => {
  if (!track) return 'Frontend';
  if (['Frontend', 'Backend', 'Full Stack', 'UI/UX', 'AI'].includes(track)) return track;
  return 'Frontend';
};

const mapApplicationStatusToProfileStatus = (appStatus) => {
  if (['APPLIED', 'SCREENING', 'SHORTLISTED', 'SELECTED'].includes(appStatus)) {
    return 'APPLIED';
  }
  if (['ONBOARDED', 'IN_PROGRESS'].includes(appStatus)) {
    return 'IN_PROGRESS';
  }
  if (appStatus === 'COMPLETED') {
    return 'COMPLETED';
  }
  return 'NOT_STARTED';
};

exports.createApplication = catchAsync(async (req, res) => {
  console.log('🔥 ADMIN INTERNSHIP CREATE', {
    adminId: req.admin?.id || null,
    registrationId: req.body.registrationId,
    internshipTrack: req.body.internshipTrack,
    applyingFor: req.body.applyingFor,
  });

  req.body.applyingFor = req.body.applyingFor || req.body.internshipTrack || req.body.role || null;
  return internshipController.apply(req, res);
});

const createOrUpdateStudentProfileForApplication = async (application) => {
  if (!application || !application.email) return null;

  const values = application.toJSON ? application.toJSON() : application;
  const email = String(values.email).trim().toLowerCase();
  const profileData = {
    applicationId: values.id,
    batchId: values.assignedBatchId || null,
    name: values.fullName,
    email,
    phone: values.phone,
    college: values.college,
    track: safeProfileTrack(values.internshipTrack),
    internshipStatus: mapApplicationStatusToProfileStatus(values.status),
    quizEligible: values.status === 'COMPLETED',
  };

  const existingProfile = await StudentProfile.findOne({ where: { applicationId: values.id } });
  if (existingProfile) {
    Object.assign(existingProfile, profileData);
    return existingProfile.save();
  }

  const profileByEmail = await StudentProfile.findOne({ where: { email } });
  if (profileByEmail) {
    Object.assign(profileByEmail, profileData);
    return profileByEmail.save();
  }

  return StudentProfile.create(profileData);
};

const formatApplication = (application) => {
  const data = application.toJSON ? application.toJSON() : application;
  return {
    ...data,
    studentName: data.fullName || data.studentName || '',
  };
};

exports.getAllApplications = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};

  if (req.query.status) where.status = req.query.status;
  if (req.query.internshipTrack) where.internshipTrack = req.query.internshipTrack;
  if (req.query.assignedBatchId) where.assignedBatchId = req.query.assignedBatchId;
  if (req.query.q) {
    where[Op.or] = [
      { fullName: { [Op.like]: `%${req.query.q}%` } },
      { email: { [Op.like]: `%${req.query.q}%` } },
      { phone: { [Op.like]: `%${req.query.q}%` } },
      { applicationId: { [Op.like]: `%${req.query.q}%` } },
    ];
  }

  const result = await InternshipApplication.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return res.status(200).json({
    success: true,
    data: result.rows.map(formatApplication),
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getApplication = catchAsync(async (req, res) => {
  const application = await InternshipApplication.findByPk(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  return res.status(200).json({ success: true, data: formatApplication(application) });
});

exports.updateApplication = catchAsync(async (req, res) => {
  const application = await InternshipApplication.findByPk(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  const oldValue = application.toJSON();
  const { studentName, fullName, email, phone, internshipTrack, status, remarks, assignedBatchId } = req.body;

  const normalizeName = studentName || fullName;
  if (normalizeName) {
    application.fullName = normalizeName;
  }
  if (email !== undefined) application.email = email;
  if (phone !== undefined) application.phone = phone;
  if (internshipTrack !== undefined) application.internshipTrack = internshipTrack;

  // Track status change for history
  let statusChanged = false;
  if (status && status !== application.status) {
    statusChanged = true;
  }

  if (status) application.status = status;
  if (remarks !== undefined) application.remarks = remarks;
  if (assignedBatchId !== undefined) application.assignedBatchId = assignedBatchId || null;

  await application.save();

  if (statusChanged) {
    try {
      await createOrUpdateStudentProfileForApplication(application);
    } catch (error) {
      console.error('[StudentProfile] auto-link/update failed:', error.message);
    }
  }

  // Record history if status changed
  if (statusChanged) {
    await InternshipHistory.create({
      applicationId: application.id,
      userId: req.admin?.id || null,
      previousStatus: oldValue.status,
      newStatus: status,
      remarks: remarks || null,
    });
  }

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'InternshipApplication',
    entityId: application.id,
    oldValue,
    newValue: application.toJSON(),
    ipAddress: req.ip,
  });

  if (status && ['SHORTLISTED', 'SELECTED', 'REJECTED', 'COMPLETED'].includes(status)) {
    sendInternshipStatusUpdate(application).catch((error) => {
      console.error('[Email] internship status update failed:', error.message);
    });
  }

  if (assignedBatchId && assignedBatchId !== oldValue.assignedBatchId) {
    sendBatchAssignmentNotification(application).catch((error) => {
      console.error('[Email] batch assignment notification failed:', error.message);
    });
  }

  return res.status(200).json({ success: true, data: application });
});

exports.deleteApplication = catchAsync(async (req, res) => {
  const application = await InternshipApplication.findByPk(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  const oldValue = application.toJSON();
  await application.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'InternshipApplication',
    entityId: application.id,
    oldValue,
    newValue: null,
    ipAddress: req.ip,
  });

  return res.status(200).json({ success: true, message: 'Application deleted' });
});

exports.getResume = catchAsync(async (req, res) => {
  const application = await InternshipApplication.findByPk(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  if (!application.resumeUrl) {
    return res.status(404).json({ success: false, message: 'No resume available for this application' });
  }

  return res.status(200).json({
    success: true,
    data: {
      resumeUrl: application.resumeUrl,
      resumeFileName: application.resumeFileName,
      resumeMimeType: application.resumeMimeType,
      resumeSize: application.resumeSize,
    },
  });
});

exports.downloadResume = catchAsync(async (req, res) => {
  const application = await InternshipApplication.findByPk(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  if (!application.resumeUrl) {
    return res.status(404).json({ success: false, message: 'No resume available for this application' });
  }

  const path = require('path');
  const fs = require('fs');
  const filePath = path.join(__dirname, '../public', application.resumeUrl);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Resume file not found' });
  }

  res.download(filePath, application.resumeFileName || 'resume');
});

exports.replaceResume = catchAsync(async (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ success: false, message: req.fileValidationError });
  }

  // If no file was uploaded, treat this as a no-op and return success
  // (resume upload is optional). If a file is present, process and replace.
  if (!req.file) {
    return res.status(200).json({ success: true, message: 'No resume uploaded' });
  }

  const application = await InternshipApplication.findByPk(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  const oldValue = application.toJSON();

  // Delete old resume file
  if (application.resumeUrl) {
    const path = require('path');
    const fs = require('fs');
    const oldFilePath = path.join(__dirname, '../public', application.resumeUrl);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }

  // Update with new resume
  const resumeUrl = `/uploads/${req.file.filename}`;
  application.resumeUrl = resumeUrl;
  application.resumeFileName = req.file.originalname;
  application.resumeMimeType = req.file.mimetype;
  application.resumeSize = req.file.size;
  await application.save();

  // Record old media in Media table for history
  const { Media } = require('../models');
  await Media.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: resumeUrl,
    url: resumeUrl,
    uploadedBy: req.admin?.id || null,
    storageProvider: 'local',
  });

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'InternshipApplication',
    entityId: application.id,
    oldValue,
    newValue: application.toJSON(),
    ipAddress: req.ip,
  });

  return res.status(200).json({
    success: true,
    data: {
      resumeUrl: application.resumeUrl,
      resumeFileName: application.resumeFileName,
      resumeMimeType: application.resumeMimeType,
      resumeSize: application.resumeSize,
    },
  });
});

exports.deleteResume = catchAsync(async (req, res) => {
  const application = await InternshipApplication.findByPk(req.params.id);
  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  if (!application.resumeUrl) {
    return res.status(404).json({ success: false, message: 'No resume to delete' });
  }

  const oldValue = application.toJSON();

  // Delete file
  const path = require('path');
  const fs = require('fs');
  const filePath = path.join(__dirname, '../public', application.resumeUrl);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Clear resume fields
  application.resumeUrl = null;
  application.resumeFileName = null;
  application.resumeMimeType = null;
  application.resumeSize = null;
  await application.save();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'InternshipApplication',
    entityId: application.id,
    oldValue,
    newValue: application.toJSON(),
    ipAddress: req.ip,
  });

  return res.status(200).json({ success: true, message: 'Resume deleted' });
});
