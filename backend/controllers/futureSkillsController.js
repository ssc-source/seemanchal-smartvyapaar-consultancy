const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { FutureSkillInquiry, ContactSubmission } = require('../models');
const { sendAdminNotification } = require('../utils/email');
const catchAsync = require('../utils/catchAsync');

const normalizeInteger = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeString = (value) => {
  if (value === null || value === undefined) return null;
  return String(value).trim() || null;
};

const normalizeStringArray = (value) => {
  if (Array.isArray(value)) {
    const normalized = value
      .filter((item) => item !== null && item !== undefined)
      .map(String)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    return normalized.length ? normalized : null;
  }

  if (typeof value === 'string' && value.trim().length > 0) return [value.trim()];
  return null;
};

// Create inquiry
exports.createInquiry = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (process.env.NODE_ENV === 'development') {
    console.debug('[FutureSkills] Incoming inquiry payload:', req.body);
  }

  const {
    schoolName,
    principalName,
    designation,
    email,
    phone,
    boardType,
    studentStrength,
    classesCovered,
    city,
    state,
    message,
    interestedPrograms,
  } = req.body;

  const normalizedStudentStrength = normalizeInteger(studentStrength);
  const normalizedClassesCovered = normalizeStringArray(classesCovered) || [];
  const normalizedInterestedPrograms = normalizeStringArray(interestedPrograms);
  const normalizedMessage = typeof message === 'string' ? message.trim() : '';
  const normalizedPhone = typeof phone === 'string' ? phone.trim() : phone;

  // Save as contact submission for safety; do not fail the whole request if this backup path fails.
  ContactSubmission.create({
    name: schoolName,
    email,
    phone: normalizedPhone || null,
    message: normalizedMessage || 'No message provided.',
  }).catch((err) => {
    console.error('Future Skills contact backup failed:', err);
  });

  // Create Future Skills Lab inquiry
  let inquiry;
  try {
    inquiry = await FutureSkillInquiry.create({
      schoolName,
      principalName,
      designation,
      email,
      phone: normalizedPhone,
      boardType,
      studentStrength: normalizedStudentStrength,
      classesCovered: normalizedClassesCovered.length ? normalizedClassesCovered : null,
      city,
      state,
      message: normalizedMessage || null,
      interestedPrograms: normalizedInterestedPrograms,
      status: 'new',
      source: 'website',
    });
  } catch (error) {
    console.error('[FutureSkills] Inquiry create failed:', {
      message: error.message,
      name: error.name,
      body: req.body,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Failed to save inquiry due to validation issues.',
        errors: error.errors.map((err) => ({ field: err.path, message: err.message })),
        requestId: req.requestId,
      });
    }

    return next(error);
  }

  // Send notification email (non-blocking)
  sendAdminNotification({
    type: 'future_skills_inquiry',
    name: schoolName || principalName || email,
    schoolName,
    principalName,
    designation,
    email,
    phone: normalizedPhone,
    boardType,
    studentStrength: normalizedStudentStrength,
    classesCovered: normalizedClassesCovered,
    city,
    state,
    message: normalizedMessage || 'No message provided.',
    source: 'website',
    serviceOfInterest: 'Future Skills Lab Inquiry',
  }).catch(err => {
    console.error('Email notification failed:', err.message);
  });

  return res.status(201).json({
    success: true,
    message: 'Thank you for your interest. Our team will contact you within 24 hours.',
    inquiryId: inquiry.id,
  });
});

// Get all inquiries (Admin)
exports.getAllInquiries = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (status) where.status = status;
  if (search) {
    where[Op.or] = [
      { schoolName: { [Op.like]: `%${search}%` } },
      { principalName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await FutureSkillInquiry.findAndCountAll({
    where,
    offset,
    limit: parseInt(limit),
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: rows,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit),
    },
  });
});

// Get single inquiry (Admin)
exports.getInquiry = catchAsync(async (req, res) => {
  const { id } = req.params;

  const inquiry = await FutureSkillInquiry.findByPk(id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }

  res.json({ success: true, data: inquiry });
});

// Update inquiry status (Admin)
exports.updateInquiry = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const inquiry = await FutureSkillInquiry.findByPk(id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }

  if (status) inquiry.status = status;
  if (notes !== undefined) inquiry.notes = notes;

  await inquiry.save();

  res.json({
    success: true,
    message: 'Inquiry updated successfully',
    data: inquiry,
  });
});

// Delete inquiry (Admin)
exports.deleteInquiry = catchAsync(async (req, res) => {
  const { id } = req.params;

  const inquiry = await FutureSkillInquiry.findByPk(id);
  if (!inquiry) {
    return res.status(404).json({ success: false, message: 'Inquiry not found' });
  }

  await inquiry.destroy();

  res.json({ success: true, message: 'Inquiry deleted successfully' });
});
