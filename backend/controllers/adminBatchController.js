const { InternshipBatch } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination, buildOrder } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');

exports.getAllBatches = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.program) where.program = req.query.program;
  if (req.query.status) where.status = req.query.status;

  const result = await InternshipBatch.findAndCountAll({
    where,
    order: buildOrder(req.query, ['name', 'status', 'startDate', 'createdAt'], [['createdAt', 'DESC']]),
    limit,
    offset,
  });

  return res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getBatch = catchAsync(async (req, res) => {
  const batch = await InternshipBatch.findByPk(req.params.id);
  if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });
  return res.status(200).json({ success: true, data: batch });
});

exports.createBatch = catchAsync(async (req, res) => {
  const payload = req.body;
  const batch = await InternshipBatch.create(payload);
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'InternshipBatch',
    entityId: batch.id,
    newValue: batch.toJSON(),
    ipAddress: req.ip,
  });
  return res.status(201).json({ success: true, data: batch });
});

exports.updateBatch = catchAsync(async (req, res) => {
  const batch = await InternshipBatch.findByPk(req.params.id);
  if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

  const oldValue = batch.toJSON();
  Object.assign(batch, req.body);
  await batch.save();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'InternshipBatch',
    entityId: batch.id,
    oldValue,
    newValue: batch.toJSON(),
    ipAddress: req.ip,
  });

  return res.status(200).json({ success: true, data: batch });
});

exports.deleteBatch = catchAsync(async (req, res) => {
  const batch = await InternshipBatch.findByPk(req.params.id);
  if (!batch) return res.status(404).json({ success: false, message: 'Batch not found' });

  const oldValue = batch.toJSON();
  await batch.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'InternshipBatch',
    entityId: batch.id,
    oldValue,
    newValue: null,
    ipAddress: req.ip,
  });

  return res.status(200).json({ success: true, message: 'Batch deleted' });
});
