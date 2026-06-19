const express = require('express');
const router = express.Router();
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const adminFutureSkillsController = require('../controllers/adminFutureSkillsController');
const futureSkillsController = require('../controllers/futureSkillsController');

// Apply protection middleware to all admin routes
router.use(protect);

// ==================== INQUIRIES ====================

// GET all inquiries with filters
router.get('/inquiries', requirePermission('manage_future_skills'), adminFutureSkillsController.getAllInquiries);

// GET single inquiry
router.get('/inquiries/:id', requirePermission('manage_future_skills'), futureSkillsController.getInquiry);

// PATCH update inquiry status and notes
router.patch('/inquiries/:id', requirePermission('manage_future_skills'), futureSkillsController.updateInquiry);

// DELETE inquiry
router.delete('/inquiries/:id', requirePermission('manage_future_skills'), futureSkillsController.deleteInquiry);

// ==================== PROGRAMS ====================

// POST create program
router.post('/programs', requirePermission('manage_future_skills'), adminFutureSkillsController.createProgram);

// GET all programs
router.get('/programs', requirePermission('manage_future_skills'), adminFutureSkillsController.getAllPrograms);

// GET single program
router.get('/programs/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.getProgram);

// PATCH update program
router.patch('/programs/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.updateProgram);

// DELETE program
router.delete('/programs/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.deleteProgram);

// ==================== WORKSHOPS ====================

// POST create workshop
router.post('/workshops', requirePermission('manage_future_skills'), adminFutureSkillsController.createWorkshop);

// GET all workshops
router.get('/workshops', requirePermission('manage_future_skills'), adminFutureSkillsController.getAllWorkshops);

// GET single workshop
router.get('/workshops/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.getWorkshop);

// PATCH update workshop
router.patch('/workshops/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.updateWorkshop);

// DELETE workshop
router.delete('/workshops/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.deleteWorkshop);

// ==================== FAQs ====================

// POST create FAQ
router.post('/faqs', requirePermission('manage_future_skills'), adminFutureSkillsController.createFAQ);

// GET all FAQs (public)
router.get('/faqs', adminFutureSkillsController.getAllFAQs);

// GET single FAQ
router.get('/faqs/:id', adminFutureSkillsController.getFAQ);

// PATCH update FAQ
router.patch('/faqs/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.updateFAQ);

// DELETE FAQ
router.delete('/faqs/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.deleteFAQ);

// ==================== TESTIMONIALS ====================

// POST create testimonial
router.post('/testimonials', requirePermission('manage_future_skills'), adminFutureSkillsController.createTestimonial);

// GET all testimonials
router.get('/testimonials', adminFutureSkillsController.getAllTestimonials);

// GET single testimonial
router.get('/testimonials/:id', adminFutureSkillsController.getTestimonial);

// PATCH update testimonial
router.patch('/testimonials/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.updateTestimonial);

// DELETE testimonial
router.delete('/testimonials/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.deleteTestimonial);

// ==================== SUCCESS STORIES ====================

// POST create success story
router.post('/success-stories', requirePermission('manage_future_skills'), adminFutureSkillsController.createSuccessStory);

// GET all success stories
router.get('/success-stories', adminFutureSkillsController.getAllSuccessStories);

// GET single success story
router.get('/success-stories/:id', adminFutureSkillsController.getSuccessStory);

// PATCH update success story
router.patch('/success-stories/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.updateSuccessStory);

// DELETE success story
router.delete('/success-stories/:id', requirePermission('manage_future_skills'), adminFutureSkillsController.deleteSuccessStory);

module.exports = router;
