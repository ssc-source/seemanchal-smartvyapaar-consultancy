const { Service } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await Service.findAll({
    where: { isActive: true },
    order: [['createdAt', 'ASC']]
  });
  return res.status(200).json({ success: true, data: services });
});

exports.getServiceBySlug = catchAsync(async (req, res, next) => {
  const service = await Service.findOne({
    where: { slug: req.params.slug, isActive: true }
  });
  if (!service) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  return res.status(200).json({ success: true, data: service });
});
