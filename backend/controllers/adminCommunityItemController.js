const { CommunityItem } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { recordAudit } = require('../utils/auditLogger');
const { getPagination, buildSearchWhere, buildOrder } = require('../utils/apiQuery');

const sanitizePayload = (body) => ({
  type: body.type,
  title: body.title,
  description: body.description,
  metadata: typeof body.metadata === 'object' && body.metadata !== null ? body.metadata : {},
  displayOrder: Number.isInteger(body.displayOrder) ? body.displayOrder : 0,
  status: body.status || 'published',
});

exports.getAllCommunityItems = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await CommunityItem.findAndCountAll({
    where: buildSearchWhere(req.query, ['type', 'title', 'status']),
    order: buildOrder(req.query, ['displayOrder', 'createdAt', 'title', 'type'], [['displayOrder', 'ASC'], ['createdAt', 'ASC']]),
    limit,
    offset,
  });
  res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getCommunityItem = catchAsync(async (req, res) => {
  const item = await CommunityItem.findByPk(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Community item not found' });
  }
  res.status(200).json({ success: true, data: item });
});

exports.createCommunityItem = catchAsync(async (req, res) => {
  const payload = sanitizePayload(req.body);
  if (!payload.type || !payload.title || !payload.description) {
    return res.status(400).json({ success: false, message: 'Required fields are missing' });
  }

  const item = await CommunityItem.create(payload);
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'CommunityItem',
    entityId: item.id,
    newValue: item.toJSON(),
    ipAddress: req.ip,
  });

  res.status(201).json({ success: true, data: item });
});

exports.updateCommunityItem = catchAsync(async (req, res) => {
  const item = await CommunityItem.findByPk(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Community item not found' });
  }

  const oldValue = item.toJSON();
  const payload = sanitizePayload(req.body);
  await item.update(payload);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'CommunityItem',
    entityId: item.id,
    oldValue,
    newValue: item.toJSON(),
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, data: item });
});

exports.deleteCommunityItem = catchAsync(async (req, res) => {
  const item = await CommunityItem.findByPk(req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Community item not found' });
  }

  const oldValue = item.toJSON();
  await item.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'CommunityItem',
    entityId: item.id,
    oldValue,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: 'Community item deleted successfully' });
});
