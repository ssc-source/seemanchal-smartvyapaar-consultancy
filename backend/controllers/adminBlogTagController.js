const { BlogTag } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { recordAudit } = require('../utils/auditLogger');
const { getPagination, buildSearchWhere, buildOrder } = require('../utils/apiQuery');
const { Op } = require('sequelize');

const sanitizePayload = (body) => ({
  name: body.name,
  slug: body.slug,
});

const validateTag = (payload) => {
  const errors = [];
  if (!payload.name) errors.push('Name is required');
  if (!payload.slug) errors.push('Slug is required');
  return errors;
};

exports.getAllBlogTags = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await BlogTag.findAndCountAll({
    where: buildSearchWhere(req.query, ['name', 'slug']),
    order: buildOrder(req.query, ['createdAt', 'name'], [['name', 'ASC']]),
    limit,
    offset,
  });

  res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getBlogTag = catchAsync(async (req, res) => {
  const tag = await BlogTag.findByPk(req.params.id);

  if (!tag) {
    return res.status(404).json({ success: false, message: 'Blog tag not found' });
  }

  res.status(200).json({ success: true, data: tag });
});

exports.createBlogTag = catchAsync(async (req, res) => {
  const payload = sanitizePayload(req.body);
  const errors = validateTag(payload);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Check uniqueness
  const existing = await BlogTag.findOne({
    where: { [Op.or]: [{ name: payload.name }, { slug: payload.slug }] },
  });

  if (existing) {
    return res.status(409).json({ success: false, message: 'Tag name or slug already exists' });
  }

  const tag = await BlogTag.create(payload);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'BlogTag',
    entityId: tag.id,
    newValue: tag.toJSON(),
    ipAddress: req.ip,
  });

  res.status(201).json({ success: true, data: tag });
});

exports.updateBlogTag = catchAsync(async (req, res) => {
  const tag = await BlogTag.findByPk(req.params.id);

  if (!tag) {
    return res.status(404).json({ success: false, message: 'Blog tag not found' });
  }

  const oldValue = tag.toJSON();
  const payload = sanitizePayload(req.body);
  const errors = validateTag(payload);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Check uniqueness (excluding self)
  const existing = await BlogTag.findOne({
    where: {
      [Op.or]: [{ name: payload.name }, { slug: payload.slug }],
      id: { [Op.ne]: tag.id },
    },
  });

  if (existing) {
    return res.status(409).json({ success: false, message: 'Tag name or slug already exists' });
  }

  await tag.update(payload);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'BlogTag',
    entityId: tag.id,
    oldValue,
    newValue: tag.toJSON(),
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, data: tag });
});

exports.deleteBlogTag = catchAsync(async (req, res) => {
  const tag = await BlogTag.findByPk(req.params.id);

  if (!tag) {
    return res.status(404).json({ success: false, message: 'Blog tag not found' });
  }

  const oldValue = tag.toJSON();
  await tag.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'BlogTag',
    entityId: tag.id,
    oldValue,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: 'Blog tag deleted successfully' });
});
