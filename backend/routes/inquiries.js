const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const inquiryController = require('../controllers/inquiryController');

// Validation middleware
const validateInquiry = [
  body('name').notEmpty().withMessage('Name is required').trim().escape(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().trim().escape(),
  body('company').optional().trim().escape(),
  body('serviceOfInterest').optional().trim().escape(),
  body('message').notEmpty().withMessage('Message is required').trim().escape(),
  body('source').optional().trim().escape(),
  body('campaign').optional().trim().escape(),
  body('medium').optional().trim().escape(),
];

// POST /api/inquiries
router.post('/', validateInquiry, inquiryController.createInquiry);

module.exports = router;
