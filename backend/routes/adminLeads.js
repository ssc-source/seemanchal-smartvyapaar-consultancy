const express = require('express');
const router = express.Router();
const adminLeadController = require('../controllers/adminLeadController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.LEADS_READ), adminLeadController.getAllLeads);

router.route('/:id')
  .get(requirePermission(PERMISSIONS.LEADS_READ), adminLeadController.getLead)
  .put(requirePermission(PERMISSIONS.LEADS_WRITE), adminLeadController.updateLead);

module.exports = router;
