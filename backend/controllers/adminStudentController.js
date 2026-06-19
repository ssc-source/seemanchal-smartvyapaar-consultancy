const { Op } = require('sequelize');
const { InternshipBatch, InternshipApplication, StudentProfile } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination, buildOrder } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');

const validateStudentReferences = async ({ batchId, applicationId }) => {
  if (batchId) {
    const batch = await InternshipBatch.findByPk(batchId);
    if (!batch) return { valid: false, message: 'Invalid batchId' };
  }
  if (applicationId) {
    const application = await InternshipApplication.findByPk(applicationId);
    if (!application) return { valid: false, message: 'Invalid applicationId' };
  }
  return { valid: true };
};

const updateBatchCounts = async (student, oldBatchId) => {
  if (oldBatchId && oldBatchId !== student.batchId) {
    const oldBatch = await InternshipBatch.findByPk(oldBatchId);
    if (oldBatch) {
      oldBatch.currentStudents = Math.max(0, oldBatch.currentStudents - 1);
      await oldBatch.save();
    }
  }
  if (student.batchId) {
    const batch = await InternshipBatch.findByPk(student.batchId);
    if (batch) {
      const count = await StudentProfile.count({ where: { batchId: student.batchId } });
      batch.currentStudents = count;
      await batch.save();
    }
  }
};

exports.getAllStudents = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.batchId) where.batchId = req.query.batchId;
  if (req.query.track) where.track = req.query.track;
  if (req.query.name) where.name = { [Op.like]: `%${req.query.name}%` };
  if (req.query.email) where.email = req.query.email;

  const result = await StudentProfile.findAndCountAll({
    where,
    order: buildOrder(req.query, ['name', 'email', 'track', 'createdAt'], [['createdAt', 'DESC']]),
    limit,
    offset,
  });

  return res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getStudent = catchAsync(async (req, res) => {
  const student = await StudentProfile.findByPk(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  return res.status(200).json({ success: true, data: student });
});

exports.createStudent = catchAsync(async (req, res) => {
  const validation = await validateStudentReferences(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message, errors: [] });
  }

  const student = await StudentProfile.create(req.body);
  await updateBatchCounts(student, null);
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'StudentProfile',
    entityId: student.id,
    newValue: student.toJSON(),
    ipAddress: req.ip,
  });
  return res.status(201).json({ success: true, data: student });
});

exports.updateStudent = catchAsync(async (req, res) => {
  const student = await StudentProfile.findByPk(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

  const validation = await validateStudentReferences(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message, errors: [] });
  }

  const oldValue = student.toJSON();
  const oldBatchId = student.batchId;
  Object.assign(student, req.body);
  await student.save();

  await updateBatchCounts(student, oldBatchId);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'StudentProfile',
    entityId: student.id,
    oldValue,
    newValue: student.toJSON(),
    ipAddress: req.ip,
  });

  return res.status(200).json({ success: true, data: student });
});

exports.deleteStudent = catchAsync(async (req, res) => {
  const student = await StudentProfile.findByPk(req.params.id);
  if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  const oldBatchId = student.batchId;
  const oldValue = student.toJSON();
  await student.destroy();
  await updateBatchCounts({ batchId: null }, oldBatchId);
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'StudentProfile',
    entityId: student.id,
    oldValue,
    newValue: null,
    ipAddress: req.ip,
  });
  return res.status(200).json({ success: true, message: 'Student deleted' });
});
