const { ContentPage } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { recordAudit } = require('../utils/auditLogger');
const { getPagination, buildSearchWhere, buildOrder } = require('../utils/apiQuery');

const sanitizePayload = (body) => {
  return {
    slug: body.slug,
    title: body.title,
    content: body.content,
    seoTitle: body.seoTitle || null,
    seoDescription: body.seoDescription || null,
    status: body.status || 'published',
    displayOrder: Number.isInteger(body.displayOrder) ? body.displayOrder : 0,
  };
};

exports.getAllContentPages = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await ContentPage.findAndCountAll({
    where: buildSearchWhere(req.query, ['slug', 'title', 'status']),
    order: buildOrder(req.query, ['displayOrder', 'createdAt', 'updatedAt', 'title'], [['displayOrder', 'ASC'], ['createdAt', 'ASC']]),
    limit,
    offset,
  });
  res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

exports.getContentPage = catchAsync(async (req, res) => {
  const page = await ContentPage.findByPk(req.params.id);
  if (!page) {
    return res.status(404).json({ success: false, message: 'Content page not found' });
  }
  res.status(200).json({ success: true, data: page });
});

exports.createContentPage = catchAsync(async (req, res) => {
  const payload = sanitizePayload(req.body);

  if (!payload.slug || !payload.title || !payload.content) {
    return res.status(400).json({ success: false, message: 'slug, title, and content are required' });
  }

  const page = await ContentPage.create(payload);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'ContentPage',
    entityId: page.id,
    newValue: page.toJSON(),
    ipAddress: req.ip,
  });

  res.status(201).json({ success: true, data: page });
});

exports.updateContentPage = catchAsync(async (req, res) => {
  const page = await ContentPage.findByPk(req.params.id);
  if (!page) {
    return res.status(404).json({ success: false, message: 'Content page not found' });
  }

  const oldValue = page.toJSON();
  const payload = sanitizePayload(req.body);

  await page.update(payload);

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'ContentPage',
    entityId: page.id,
    oldValue,
    newValue: page.toJSON(),
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, data: page });
});

exports.deleteContentPage = catchAsync(async (req, res) => {
  const page = await ContentPage.findByPk(req.params.id);
  if (!page) {
    return res.status(404).json({ success: false, message: 'Content page not found' });
  }

  const oldValue = page.toJSON();
  await page.destroy();

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'ContentPage',
    entityId: page.id,
    oldValue,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: 'Content page deleted successfully' });
});
