const { Testimonial } = require('../models');

// GET /api/testimonials
exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};