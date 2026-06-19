const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');
const studentDashboardController = require('../controllers/studentDashboardController');

router.use(protect);

router.get('/me', studentController.me);
router.get('/dashboard', studentDashboardController.getDashboard);

module.exports = router;
