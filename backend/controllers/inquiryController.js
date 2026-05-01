const { validationResult } = require('express-validator');
const { Lead, ContactSubmission } = require('../models');
const { sendAdminNotification } = require('../utils/email');
const catchAsync = require('../utils/catchAsync');

exports.createInquiry = catchAsync(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, email, phone, company, serviceOfInterest, message,
      source, campaign, medium
    } = req.body;

    // Save as raw submission first for safety
    await ContactSubmission.create({ name, email, phone, message });

    // Save as a formatted Lead
    const newLead = await Lead.create({
      name,
      email,
      phone,
      company,
      serviceOfInterest,
      message,
      source: source || 'direct',
      campaign,
      medium,
      status: 'new'
    });

    // Send Email Notification via Nodemailer
    await sendAdminNotification({
      name,
      email,
      phone,
      company,
      serviceOfInterest,
      message,
      source: source || 'direct'
    });

  return res.status(201).json({
    success: true,
    message: 'Inquiry submitted successfully',
    leadId: newLead.id
  });
});
