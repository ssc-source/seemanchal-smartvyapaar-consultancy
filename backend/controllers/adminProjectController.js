const { Project } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination, buildSearchWhere, buildOrder } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');

// Get all projects
exports.getAllProjects = catchAsync(async (req, res, next) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await Project.findAndCountAll({
    where: buildSearchWhere(req.query, ['title', 'slug', 'clientName', 'category']),
    order: buildOrder(req.query, ['title', 'slug', 'clientName', 'category', 'createdAt'], [['createdAt', 'DESC']]),
    limit,
    offset,
  });
  return res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

// Create a project
exports.createProject = catchAsync(async (req, res, next) => {
  const project = await Project.create(req.body);
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'Project',
    entityId: project.id,
    newValue: project.toJSON(),
    ipAddress: req.ip,
  });
  return res.status(201).json({ success: true, data: project });
});

// Update a project
exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  
  const oldValue = project.toJSON();
  await project.update(req.body);
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'Project',
    entityId: project.id,
    oldValue,
    newValue: project.toJSON(),
    ipAddress: req.ip,
  });
  return res.status(200).json({ success: true, data: project });
});

// Delete a project
exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  
  const oldValue = project.toJSON();
  await project.destroy();
  await recordAudit({
    userId: req.admin?.id || null,
    action: 'DELETE',
    entityType: 'Project',
    entityId: project.id,
    oldValue,
    ipAddress: req.ip,
  });
  return res.status(200).json({ success: true, message: 'Project deleted' });
});
