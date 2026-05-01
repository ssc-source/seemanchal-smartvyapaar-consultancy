const { Project } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.findAll({
    where: { isActive: true },
    order: [['createdAt', 'DESC']]
  });

  return res.status(200).json({ success: true, data: projects });
});

exports.getProjectBySlug = catchAsync(async (req, res, next) => {
  const project = await Project.findOne({
    where: { slug: req.params.slug, isActive: true }
  });

  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  return res.status(200).json({ success: true, data: project });
});