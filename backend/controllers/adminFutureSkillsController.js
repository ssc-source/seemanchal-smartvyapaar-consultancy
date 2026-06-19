const {
  FutureSkillInquiry,
  FutureSkillProgram,
  FutureSkillWorkshop,
  FutureSkillFAQ,
  FutureSkillTestimonial,
  FutureSkillSuccessStory,
} = require('../models');
const { Op } = require('sequelize');
const catchAsync = require('../utils/catchAsync');

// ==================== INQUIRIES ====================

exports.getAllInquiries = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const offset = (page - 1) * limit;

  const where = {};
  if (status) where.status = status;
  if (search) {
    where[Op.or] = [
      { schoolName: { [Op.like]: `%${search}%` } },
      { principalName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
      { city: { [Op.like]: `%${search}%` } },
      { state: { [Op.like]: `%${search}%` } },
    ];
  }

  const { count, rows } = await FutureSkillInquiry.findAndCountAll({
    where,
    offset,
    limit: parseInt(limit),
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: rows,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit),
    },
  });
});

// ==================== PROGRAMS ====================

exports.createProgram = catchAsync(async (req, res) => {
  const { title, slug, description, pillar, shortDescription, icon, features, outcomes, targetClasses, duration } = req.body;

  const program = await FutureSkillProgram.create({
    title,
    slug,
    description,
    pillar,
    shortDescription,
    icon,
    features,
    outcomes,
    targetClasses,
    duration,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: 'Program created successfully',
    data: program,
  });
});

exports.getAllPrograms = catchAsync(async (req, res) => {
  const programs = await FutureSkillProgram.findAll({
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: programs,
  });
});

exports.getProgram = catchAsync(async (req, res) => {
  const { id } = req.params;
  const program = await FutureSkillProgram.findByPk(id);

  if (!program) {
    return res.status(404).json({ success: false, message: 'Program not found' });
  }

  res.json({ success: true, data: program });
});

exports.updateProgram = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const program = await FutureSkillProgram.findByPk(id);
  if (!program) {
    return res.status(404).json({ success: false, message: 'Program not found' });
  }

  await program.update(updates);

  res.json({
    success: true,
    message: 'Program updated successfully',
    data: program,
  });
});

exports.deleteProgram = catchAsync(async (req, res) => {
  const { id } = req.params;

  const program = await FutureSkillProgram.findByPk(id);
  if (!program) {
    return res.status(404).json({ success: false, message: 'Program not found' });
  }

  await program.destroy();

  res.json({ success: true, message: 'Program deleted successfully' });
});

// ==================== WORKSHOPS ====================

exports.createWorkshop = catchAsync(async (req, res) => {
  const { title, slug, description, programId, duration, format, targetAudience, agenda, deliverables, maxParticipants } = req.body;

  const workshop = await FutureSkillWorkshop.create({
    title,
    slug,
    description,
    programId,
    duration,
    format,
    targetAudience,
    agenda,
    deliverables,
    maxParticipants,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: 'Workshop created successfully',
    data: workshop,
  });
});

exports.getAllWorkshops = catchAsync(async (req, res) => {
  const workshops = await FutureSkillWorkshop.findAll({
    order: [['createdAt', 'DESC']],
  });

  res.json({
    success: true,
    data: workshops,
  });
});

exports.getWorkshop = catchAsync(async (req, res) => {
  const { id } = req.params;
  const workshop = await FutureSkillWorkshop.findByPk(id);

  if (!workshop) {
    return res.status(404).json({ success: false, message: 'Workshop not found' });
  }

  res.json({ success: true, data: workshop });
});

exports.updateWorkshop = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const workshop = await FutureSkillWorkshop.findByPk(id);
  if (!workshop) {
    return res.status(404).json({ success: false, message: 'Workshop not found' });
  }

  await workshop.update(updates);

  res.json({
    success: true,
    message: 'Workshop updated successfully',
    data: workshop,
  });
});

exports.deleteWorkshop = catchAsync(async (req, res) => {
  const { id } = req.params;

  const workshop = await FutureSkillWorkshop.findByPk(id);
  if (!workshop) {
    return res.status(404).json({ success: false, message: 'Workshop not found' });
  }

  await workshop.destroy();

  res.json({ success: true, message: 'Workshop deleted successfully' });
});

// ==================== FAQs ====================

exports.createFAQ = catchAsync(async (req, res) => {
  const { question, answer, category, order } = req.body;

  const faq = await FutureSkillFAQ.create({
    question,
    answer,
    category,
    order,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: 'FAQ created successfully',
    data: faq,
  });
});

exports.getAllFAQs = catchAsync(async (req, res) => {
  const faqs = await FutureSkillFAQ.findAll({
    where: { isActive: true },
    order: [['order', 'ASC']],
  });

  res.json({
    success: true,
    data: faqs,
  });
});

exports.getFAQ = catchAsync(async (req, res) => {
  const { id } = req.params;
  const faq = await FutureSkillFAQ.findByPk(id);

  if (!faq) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }

  res.json({ success: true, data: faq });
});

exports.updateFAQ = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const faq = await FutureSkillFAQ.findByPk(id);
  if (!faq) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }

  await faq.update(updates);

  res.json({
    success: true,
    message: 'FAQ updated successfully',
    data: faq,
  });
});

exports.deleteFAQ = catchAsync(async (req, res) => {
  const { id } = req.params;

  const faq = await FutureSkillFAQ.findByPk(id);
  if (!faq) {
    return res.status(404).json({ success: false, message: 'FAQ not found' });
  }

  await faq.destroy();

  res.json({ success: true, message: 'FAQ deleted successfully' });
});

// ==================== TESTIMONIALS ====================

exports.createTestimonial = catchAsync(async (req, res) => {
  const { schoolName, contactPerson, designation, testimonialText, programsUsed, impactMetrics, image, rating } = req.body;

  const testimonial = await FutureSkillTestimonial.create({
    schoolName,
    contactPerson,
    designation,
    testimonialText,
    programsUsed,
    impactMetrics,
    image,
    rating,
    isPublished: false,
  });

  res.status(201).json({
    success: true,
    message: 'Testimonial created successfully',
    data: testimonial,
  });
});

exports.getAllTestimonials = catchAsync(async (req, res) => {
  const { published } = req.query;
  const where = published === 'true' ? { isPublished: true } : {};

  const testimonials = await FutureSkillTestimonial.findAll({
    where,
    order: [['order', 'ASC']],
  });

  res.json({
    success: true,
    data: testimonials,
  });
});

exports.getTestimonial = catchAsync(async (req, res) => {
  const { id } = req.params;
  const testimonial = await FutureSkillTestimonial.findByPk(id);

  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }

  res.json({ success: true, data: testimonial });
});

exports.updateTestimonial = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const testimonial = await FutureSkillTestimonial.findByPk(id);
  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }

  await testimonial.update(updates);

  res.json({
    success: true,
    message: 'Testimonial updated successfully',
    data: testimonial,
  });
});

exports.deleteTestimonial = catchAsync(async (req, res) => {
  const { id } = req.params;

  const testimonial = await FutureSkillTestimonial.findByPk(id);
  if (!testimonial) {
    return res.status(404).json({ success: false, message: 'Testimonial not found' });
  }

  await testimonial.destroy();

  res.json({ success: true, message: 'Testimonial deleted successfully' });
});

// ==================== SUCCESS STORIES ====================

exports.createSuccessStory = catchAsync(async (req, res) => {
  const { title, slug, schoolName, location, summary, fullStory, programs, outcomes, image, contactPerson } = req.body;

  const story = await FutureSkillSuccessStory.create({
    title,
    slug,
    schoolName,
    location,
    summary,
    fullStory,
    programs,
    outcomes,
    image,
    contactPerson,
    isPublished: false,
  });

  res.status(201).json({
    success: true,
    message: 'Success story created successfully',
    data: story,
  });
});

exports.getAllSuccessStories = catchAsync(async (req, res) => {
  const { published } = req.query;
  const where = published === 'true' ? { isPublished: true } : {};

  const stories = await FutureSkillSuccessStory.findAll({
    where,
    order: [['order', 'ASC']],
  });

  res.json({
    success: true,
    data: stories,
  });
});

exports.getSuccessStory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const story = await FutureSkillSuccessStory.findByPk(id);

  if (!story) {
    return res.status(404).json({ success: false, message: 'Success story not found' });
  }

  res.json({ success: true, data: story });
});

exports.updateSuccessStory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const story = await FutureSkillSuccessStory.findByPk(id);
  if (!story) {
    return res.status(404).json({ success: false, message: 'Success story not found' });
  }

  await story.update(updates);

  res.json({
    success: true,
    message: 'Success story updated successfully',
    data: story,
  });
});

exports.deleteSuccessStory = catchAsync(async (req, res) => {
  const { id } = req.params;

  const story = await FutureSkillSuccessStory.findByPk(id);
  if (!story) {
    return res.status(404).json({ success: false, message: 'Success story not found' });
  }

  await story.destroy();

  res.json({ success: true, message: 'Success story deleted successfully' });
});
