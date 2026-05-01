const { Service } = require('../models');
const catchAsync = require('../utils/catchAsync');

// Get all services
exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await Service.findAll({ order: [['createdAt', 'ASC']] });
  return res.status(200).json({ success: true, data: services });
});

// Create a service
exports.createService = catchAsync(async (req, res, next) => {
  const service = await Service.create(req.body);
  return res.status(201).json({ success: true, data: service });
});

// Update a service
exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  
  await service.update(req.body);
  return res.status(200).json({ success: true, data: service });
});

// Delete a service
exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByPk(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  
  await service.destroy();
  return res.status(200).json({ success: true, message: 'Service deleted' });
});
