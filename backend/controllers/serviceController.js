const { Service } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllServices = catchAsync(async (req, res, next) => {
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      console.warn('Services query timeout after 3s');
      return res.status(200).json({ success: true, data: [] });
    }
  }, 3000);

  try {
    const services = await Service.findAll({
      where: { isActive: true },
      order: [['createdAt', 'ASC']]
    });
    clearTimeout(timeoutId);
    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    clearTimeout(timeoutId);
    next(error);
  }
});

exports.getServiceBySlug = catchAsync(async (req, res, next) => {
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      console.warn(`Service query timeout after 3s for slug ${req.params.slug}`);
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
  }, 3000);

  try {
    const service = await Service.findOne({
      where: { slug: req.params.slug, isActive: true }
    });
    clearTimeout(timeoutId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(200).json({ success: true, data: service });
  } catch (error) {
    clearTimeout(timeoutId);
    next(error);
  }
});
