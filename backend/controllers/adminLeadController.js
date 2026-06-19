const { Lead, LeadNote, LeadHistory, LeadAssignment, User } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination, buildOrder } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');
const { Op } = require('sequelize');

// Get all leads
exports.getAllLeads = catchAsync(async (req, res, next) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  
  if (req.query.status) where.status = req.query.status;
  if (req.query.source) where.source = req.query.source;
  if (req.query.q) {
    where[Op.or] = [
      { name: { [Op.like]: `%${req.query.q}%` } },
      { email: { [Op.like]: `%${req.query.q}%` } },
      { phone: { [Op.like]: `%${req.query.q}%` } },
      { company: { [Op.like]: `%${req.query.q}%` } },
    ];
  }

  const result = await Lead.findAndCountAll({
    where,
    order: buildOrder(req.query, ['status', 'createdAt', 'updatedAt'], [['createdAt', 'DESC']]),
    limit,
    offset,
  });
  return res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

// Export leads as CSV
exports.exportLeads = catchAsync(async (req, res, next) => {
  const where = {};
  
  if (req.query.status) where.status = req.query.status;
  if (req.query.source) where.source = req.query.source;
  if (req.query.q) {
    where[Op.or] = [
      { name: { [Op.like]: `%${req.query.q}%` } },
      { email: { [Op.like]: `%${req.query.q}%` } },
      { company: { [Op.like]: `%${req.query.q}%` } },
    ];
  }

  const leads = await Lead.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });

  // Generate CSV
  const csv = [
    ['ID', 'Name', 'Email', 'Phone', 'Company', 'Service', 'Status', 'Source', 'Created At'].join(','),
    ...leads.map(lead => [
      lead.id,
      `"${lead.name}"`,
      lead.email,
      lead.phone || '',
      `"${lead.company || ''}"`,
      `"${lead.serviceOfInterest || ''}"`,
      lead.status,
      lead.source || '',
      lead.createdAt,
    ].join(',')),
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads-export.csv"');
  res.send(csv);
});

// Get a single lead with all related data
exports.getLead = catchAsync(async (req, res, next) => {
  const lead = await Lead.findByPk(req.params.id, {
    include: [
      { model: LeadNote, as: 'notes' },
      { model: LeadHistory, as: 'history' },
      { model: LeadAssignment, as: 'assignments', include: [
          { model: User, as: 'assignedToUser', attributes: ['id', 'email', 'name'] },
        ]
      },
    ],
  });
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }
  return res.status(200).json({ success: true, data: lead });
});

// Update lead status/notes
exports.updateLead = catchAsync(async (req, res, next) => {
  const { status, notes } = req.body;
  const lead = await Lead.findByPk(req.params.id);
  
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  const oldValue = lead.toJSON();
  let statusChanged = false;

  if (status && status !== lead.status) {
    statusChanged = true;
    lead.status = status;
  }
  if (notes !== undefined) lead.notes = notes;

  await lead.save();

  // Record history if status changed
  if (statusChanged) {
    await LeadHistory.create({
      leadId: lead.id,
      userId: req.admin?.id || null,
      previousStatus: oldValue.status,
      newStatus: status,
      remarks: notes || null,
    });
  }

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'UPDATE',
    entityType: 'Lead',
    entityId: lead.id,
    oldValue,
    newValue: lead.toJSON(),
    ipAddress: req.ip,
  });
  return res.status(200).json({ success: true, data: lead });
});

// Get lead notes
exports.getLeadNotes = catchAsync(async (req, res) => {
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  const { page, limit, offset } = getPagination(req.query);
  const result = await LeadNote.findAndCountAll({
    where: { leadId: req.params.id },
    include: [{ model: User, attributes: ['id', 'email', 'name'] }],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

// Create lead note
exports.createLeadNote = catchAsync(async (req, res) => {
  const { content } = req.body;
  
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({ success: false, message: 'Content cannot be empty', errors: [] });
  }

  const note = await LeadNote.create({
    leadId: req.params.id,
    userId: req.admin?.id || null,
    content,
  });

  await recordAudit({
    userId: req.admin?.id || null,
    action: 'CREATE',
    entityType: 'LeadNote',
    entityId: note.id,
    newValue: note.toJSON(),
    ipAddress: req.ip,
  });

  const noteWithUser = await note.reload({
    include: [{ model: User, attributes: ['id', 'email', 'name'] }],
  });

  return res.status(201).json({ success: true, data: noteWithUser });
});

// Get lead history
exports.getLeadHistory = catchAsync(async (req, res) => {
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  const { page, limit, offset } = getPagination(req.query);
  const result = await LeadHistory.findAndCountAll({
    where: { leadId: req.params.id },
    include: [{ model: User, attributes: ['id', 'email', 'name'] }],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});
