const { Lead, ContactSubmission } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination, buildOrder } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');

// Get all leads
exports.getAllLeads = catchAsync(async (req, res, next) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {};
  if (req.query.status) where.status = req.query.status;

  const result = await Lead.findAndCountAll({
    where,
    include: [{ model: ContactSubmission }],
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

// Get a single lead
exports.getLead = catchAsync(async (req, res, next) => {
  const lead = await Lead.findByPk(req.params.id, {
    include: [{ model: ContactSubmission }]
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
  if (status) lead.status = status;
  if (notes !== undefined) lead.notes = notes;

  await lead.save();
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
