const express = require('express');
const router = express.Router();
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');
const dashboardController = require('../controllers/adminDashboardController');

router.use(protect);

router.get(
  '/metrics',
  requirePermission(PERMISSIONS.DASHBOARD_READ),
  dashboardController.getMetrics
);

router.get(
  '/recent-activity',
  requirePermission(PERMISSIONS.DASHBOARD_READ),
  dashboardController.getRecentActivity
);

router.get(
  '/charts',
  requirePermission(PERMISSIONS.DASHBOARD_READ),
  dashboardController.getCharts
);

module.exports = router;
