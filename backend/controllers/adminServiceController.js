const { Service } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination, buildSearchWhere, buildOrder } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');

// Get all services
exports.getAllServices = catchAsync(async (req, res, next) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await Service.findAndCountAll({
    where: buildSearchWhere(req.query, ['title', 'slug', 'shortDescription']),
    order: buildOrder(req.query, ['title', 'slug', 'createdAt', 'updatedAt'], [['createdAt', 'ASC']]),
    limit,
    offset,
  });
  return res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

// Create a service
exports.createService = catchAsync(async (req, res, next) => {
  const service = await Service.create(req.body);
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'Service',
    entityId: service.id,
    newValue: service.toJSON(),
    ipAddress: req.ip,
  });
  return res.status(201).json({ success: true, data: service });
});

// Update a service
exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  
  const oldValue = service.toJSON();
  await service.update(req.body);
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'Service',
    entityId: service.id,
    oldValue,
    newValue: service.toJSON(),
    ipAddress: req.ip,
  });
  return res.status(200).json({ success: true, data: service });
});

// Delete a service
exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  
  const oldValue = service.toJSON();
  await service.destroy();
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'Service',
    entityId: service.id,
    oldValue,
    ipAddress: req.ip,
  });
  return res.status(200).json({ success: true, message: 'Service deleted' });
});
