const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

// Public payment entrypoint for guest/learners
router.post('/create-order', requireAuth, paymentController.createOrder);
router.post('/verify', requireAuth, paymentController.verify);
router.get('/student', requireAuth, paymentController.getStudentPayments);
router.get('/:id/invoice', requireAuth, paymentController.getInvoice);
router.get('/:id/summary', requireAuth, paymentController.getRegistrationById);

// Admin routes
router.get('/', requireAdmin, paymentController.getAdminPayments);
router.get('/:id', requireAdmin, paymentController.getAdminPaymentById);
router.post('/refund', requireAdmin, paymentController.refund);

module.exports = router;
