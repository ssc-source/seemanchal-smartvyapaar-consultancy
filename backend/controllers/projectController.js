const { Project } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      console.warn('Projects query timeout after 3s');
      return res.status(200).json({ success: true, data: [] });
    }
  }, 3000);

  try {
    const projects = await Project.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    clearTimeout(timeoutId);
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    clearTimeout(timeoutId);
    next(error);
  }
});

exports.getProjectBySlug = catchAsync(async (req, res, next) => {
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      console.warn(`Project query timeout after 3s for slug ${req.params.slug}`);
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
  }, 3000);

  try {
    const project = await Project.findOne({
      where: { slug: req.params.slug, isActive: true }
    });
    clearTimeout(timeoutId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    clearTimeout(timeoutId);
    next(error);
  }
});