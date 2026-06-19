const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middlewares/authMiddleware');
const revenue = require('../controllers/adminRevenueController');

router.use(requireAdmin);

router.get('/summary', revenue.getSummary);
router.get('/payments', revenue.listPayments);
router.get('/payments/export', revenue.exportPayments);

module.exports = router;
