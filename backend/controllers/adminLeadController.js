const { Lead, ContactSubmission } = require('../models');
const catchAsync = require('../utils/catchAsync');

// Get all leads
exports.getAllLeads = catchAsync(async (req, res, next) => {
  const leads = await Lead.findAll({
    include: [{ model: ContactSubmission }],
    order: [['createdAt', 'DESC']]
  });
  return res.status(200).json({ success: true, data: leads });
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

  if (status) lead.status = status;
  if (notes !== undefined) lead.notes = notes;

  await lead.save();
  return res.status(200).json({ success: true, data: lead });
});
