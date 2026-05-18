const { validationResult } = require('express-validator');
const { Lead, ContactSubmission } = require('../models');
const { sendAdminNotification } = require('../utils/email');
const catchAsync = require('../utils/catchAsync');

exports.createInquiry = catchAsync(async (req, res, next) => {
    console.log('🟪 [InquiryController] POST /api/inquiries received', {
      method: req.method,
      url: req.url,
      contentType: req.headers['content-type'],
      bodyKeys: Object.keys(req.body || {}),
      timestamp: new Date().toISOString()
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.warn('🟨 [InquiryController] Validation errors', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, email, phone, company, serviceOfInterest, message,
      source, campaign, medium
    } = req.body;

    console.log('🟪 [InquiryController] Creating contact submission...', { name, email });

    // Save as raw submission first for safety
    const contactSubmission = await ContactSubmission.create({ name, email, phone, message });
    console.log('🟪 [InquiryController] Contact submission saved', { 
      id: contactSubmission?.id 
    });

    console.log('🟪 [InquiryController] Creating lead record...', { name, email, serviceOfInterest });

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

    console.log('🟪 [InquiryController] Lead created successfully', { 
      leadId: newLead?.id 
    });

    // Send Email Notification via Resend (non-blocking)
    // Email failure won't crash the submission
    console.log('🟪 [InquiryController] Triggering Resend email notification (non-blocking)...');
    sendAdminNotification({
      name,
      email,
      phone,
      company,
      serviceOfInterest,
      message,
      source: source || 'direct'
    }).catch(error => {
      // Log the error but don't throw - inquiry is already saved
      console.error('🟥 [InquiryController] Resend notification failed (non-blocking):', error.message);
    });

    console.log('🟪 [InquiryController] Sending success response', { 
      leadId: newLead?.id,
      success: true 
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      leadId: newLead.id
    });
});
