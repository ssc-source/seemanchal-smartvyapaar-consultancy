const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const futureSkillsController = require('../controllers/futureSkillsController');
const proposalController = require('../controllers/proposalController');
const { FutureSkillFAQ, FutureSkillProgram } = require('../models');

// Validation middleware for inquiry
const validateInquiry = [
  body('schoolName').notEmpty().withMessage('School name is required').trim().escape(),
  body('principalName').notEmpty().withMessage('Principal name is required').trim().escape(),
  body('designation').optional().trim().escape(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone is required').trim().escape(),
  body('boardType').isIn(['state_board', 'cbse', 'icse', 'igcse', 'other']).withMessage('Invalid board type'),
  body('studentStrength')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Student strength must be a positive integer'),
  body('classesCovered')
    .optional({ nullable: true })
    .customSanitizer((value) => (Array.isArray(value) ? value : value ? [value] : []))
    .custom((value) => Array.isArray(value))
    .withMessage('Classes covered must be an array'),
  body('city').notEmpty().withMessage('City is required').trim().escape(),
  body('state').notEmpty().withMessage('State is required').trim().escape(),
  body('message').optional().trim().escape(),
  body('interestedPrograms')
    .optional()
    .customSanitizer((value) => (Array.isArray(value) ? value : value ? [value] : []))
    .custom((value) => Array.isArray(value))
    .withMessage('Interested programs must be an array'),
];

// POST /api/future-skills/inquiry - Create inquiry
router.post('/inquiry', validateInquiry, futureSkillsController.createInquiry);

// Validation middleware for proposal
const validateProposal = [
  body('schoolName').notEmpty().withMessage('School name is required').trim(),
  body('principalName').notEmpty().withMessage('Principal name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').notEmpty().withMessage('Phone number is required').trim(),
  body('schoolAddress').notEmpty().withMessage('School address is required').trim(),
];

// POST /api/future-skills/proposal - Generate and download school proposal
router.post('/proposal', validateProposal, proposalController.generateProposal);

// GET /api/future-skills/faqs - Get all FAQs
router.get('/faqs', async (req, res) => {
  try {
    const faqs = await FutureSkillFAQ.findAll({
      where: { isActive: true },
      order: [['order', 'ASC']],
    });
    return res.status(200).json({
      success: true,
      message: 'FAQs retrieved successfully',
      data: faqs,
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: error.message,
    });
  }
});

// GET /api/future-skills/programs - Get all programs
router.get('/programs', async (req, res) => {
  try {
    const programs = await FutureSkillProgram.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({
      success: true,
      message: 'Programs retrieved successfully',
      data: programs,
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch programs',
      error: error.message,
    });
  }
});

module.exports = router;
