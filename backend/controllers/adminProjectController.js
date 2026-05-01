const { Project } = require('../models');
const catchAsync = require('../utils/catchAsync');

// Get all projects
exports.getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
  return res.status(200).json({ success: true, data: projects });
});

// Create a project
exports.createProject = catchAsync(async (req, res, next) => {
  const project = await Project.create(req.body);
  return res.status(201).json({ success: true, data: project });
});

// Update a project
exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  
  await project.update(req.body);
  return res.status(200).json({ success: true, data: project });
});

// Delete a project
exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  
  await project.destroy();
  return res.status(200).json({ success: true, message: 'Project deleted' });
});
