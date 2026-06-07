const { JobOpening } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { recordAudit } = require('../utils/auditLogger');
const { getPagination, buildSearchWhere, buildOrder } = require('../utils/apiQuery');

const sanitizePayload = (body) => ({
  title: body.title,
  department: body.department,
  employmentType: body.employmentType,
  location: body.location,
  experience: body.experience,
  description: body.description,
  skills: Array.isArray(body.skills) ? body.skills : [],
  displayOrder: Number.isInteger(body.displayOrder) ? body.displayOrder : 0,
  status: body.status || 'published',
});

exports.getAllJobOpenings = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await JobOpening.findAndCountAll({
    where: buildSearchWhere(req.query, ['title', 'department', 'location', 'status']),
    order: buildOrder(req.query, ['displayOrder', 'createdAt', 'title', 'department'], [['displayOrder', 'ASC'], ['createdAt', 'ASC']]),
    limit,
    offset,
  });
  res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getJobOpening = catchAsync(async (req, res) => {
  const opening = await JobOpening.findByPk(req.params.id);
  if (!opening) {
    return res.status(404).json({ success: false, message: 'Job opening not found' });
  }
  res.status(200).json({ success: true, data: opening });
});

exports.createJobOpening = catchAsync(async (req, res) => {
  const payload = sanitizePayload(req.body);
  if (!payload.title || !payload.department || !payload.employmentType || !payload.location || !payload.description) {
    return res.status(400).json({ success: false, message: 'Required fields are missing' });
  }

  const opening = await JobOpening.create(payload);
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'JobOpening',
    entityId: opening.id,
    newValue: opening.toJSON(),
    ipAddress: req.ip,
  });

  res.status(201).json({ success: true, data: opening });
});

exports.updateJobOpening = catchAsync(async (req, res) => {
  const opening = await JobOpening.findByPk(req.params.id);
  if (!opening) {
    return res.status(404).json({ success: false, message: 'Job opening not found' });
  }

  const oldValue = opening.toJSON();
  const payload = sanitizePayload(req.body);
  await opening.update(payload);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'JobOpening',
    entityId: opening.id,
    oldValue,
    newValue: opening.toJSON(),
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, data: opening });
});

exports.deleteJobOpening = catchAsync(async (req, res) => {
  const opening = await JobOpening.findByPk(req.params.id);
  if (!opening) {
    return res.status(404).json({ success: false, message: 'Job opening not found' });
  }

  const oldValue = opening.toJSON();
  await opening.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'JobOpening',
    entityId: opening.id,
    oldValue,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: 'Job opening deleted successfully' });
});
