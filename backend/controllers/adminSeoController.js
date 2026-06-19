const { SeoMetadata } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { recordAudit } = require('../utils/auditLogger');

const sanitize = (body) => ({
  pageKey: body.pageKey,
  title: body.title || null,
  description: body.description || null,
  canonicalUrl: body.canonicalUrl || null,
  ogTitle: body.ogTitle || null,
  ogDescription: body.ogDescription || null,
  ogImage: body.ogImage || null,
  robots: body.robots || null,
  structuredData: body.structuredData || null,
  status: body.status || 'published',
  displayOrder: Number.isInteger(body.displayOrder) ? body.displayOrder : 0,
});

exports.getAll = catchAsync(async (req, res) => {
  const rows = await SeoMetadata.findAll({ order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']] });
  res.status(200).json({ success: true, data: rows });
});

exports.get = catchAsync(async (req, res) => {
  const entry = await SeoMetadata.findByPk(req.params.id);
  if (!entry) return res.status(404).json({ success: false, message: 'SEO entry not found' });
  res.status(200).json({ success: true, data: entry });
});

exports.create = catchAsync(async (req, res) => {
  const payload = sanitize(req.body);
  if (!payload.pageKey) return res.status(400).json({ success: false, message: 'pageKey is required' });

  const entry = await SeoMetadata.create(payload);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'SeoMetadata',
    entityId: entry.id,
    newValue: entry.toJSON(),
    ipAddress: req.ip,
  });

  res.status(201).json({ success: true, data: entry });
});

exports.update = catchAsync(async (req, res) => {
  const entry = await SeoMetadata.findByPk(req.params.id);
  if (!entry) return res.status(404).json({ success: false, message: 'SEO entry not found' });

  const oldValue = entry.toJSON();
  const payload = sanitize(req.body);

  await entry.update(payload);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'SeoMetadata',
    entityId: entry.id,
    oldValue,
    newValue: entry.toJSON(),
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, data: entry });
});

exports.remove = catchAsync(async (req, res) => {
  const entry = await SeoMetadata.findByPk(req.params.id);
  if (!entry) return res.status(404).json({ success: false, message: 'SEO entry not found' });

  const oldValue = entry.toJSON();
  await entry.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'SeoMetadata',
    entityId: entry.id,
    oldValue,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: 'Deleted' });
});
