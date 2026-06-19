const { BlogCategory } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { recordAudit } = require('../utils/auditLogger');
const { getPagination, buildSearchWhere, buildOrder } = require('../utils/apiQuery');
const { Op } = require('sequelize');

const sanitizePayload = (body) => ({
  name: body.name,
  slug: body.slug,
  description: body.description || null,
});

const validateCategory = (payload) => {
  const errors = [];
  if (!payload.name) errors.push('Name is required');
  if (!payload.slug) errors.push('Slug is required');
  return errors;
};

exports.getAllBlogCategories = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await BlogCategory.findAndCountAll({
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

exports.getBlogCategory = catchAsync(async (req, res) => {
  const category = await BlogCategory.findByPk(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Blog category not found' });
  }

  res.status(200).json({ success: true, data: category });
});

exports.createBlogCategory = catchAsync(async (req, res) => {
  const payload = sanitizePayload(req.body);
  const errors = validateCategory(payload);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Check uniqueness
  const existing = await BlogCategory.findOne({
    where: { [Op.or]: [{ name: payload.name }, { slug: payload.slug }] },
  });

  if (existing) {
    return res.status(409).json({ success: false, message: 'Category name or slug already exists' });
  }

  const category = await BlogCategory.create(payload);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'BlogCategory',
    entityId: category.id,
    newValue: category.toJSON(),
    ipAddress: req.ip,
  });

  res.status(201).json({ success: true, data: category });
});

exports.updateBlogCategory = catchAsync(async (req, res) => {
  const category = await BlogCategory.findByPk(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Blog category not found' });
  }

  const oldValue = category.toJSON();
  const payload = sanitizePayload(req.body);
  const errors = validateCategory(payload);

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }

  // Check uniqueness (excluding self)
  const existing = await BlogCategory.findOne({
    where: {
      [Op.or]: [{ name: payload.name }, { slug: payload.slug }],
      id: { [Op.ne]: category.id },
    },
  });

  if (existing) {
    return res.status(409).json({ success: false, message: 'Category name or slug already exists' });
  }

  await category.update(payload);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'BlogCategory',
    entityId: category.id,
    oldValue,
    newValue: category.toJSON(),
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, data: category });
});

exports.deleteBlogCategory = catchAsync(async (req, res) => {
  const category = await BlogCategory.findByPk(req.params.id);

  if (!category) {
    return res.status(404).json({ success: false, message: 'Blog category not found' });
  }

  const oldValue = category.toJSON();
  await category.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'BlogCategory',
    entityId: category.id,
    oldValue,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: 'Blog category deleted successfully' });
});
