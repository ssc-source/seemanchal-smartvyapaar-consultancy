const express = require('express');
const router = express.Router();
const adminLeadController = require('../controllers/adminLeadController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.LEADS_READ), adminLeadController.getAllLeads);

router.route('/export')
  .get(requirePermission(PERMISSIONS.LEADS_READ), adminLeadController.exportLeads);

router.route('/:id')
  .get(requirePermission(PERMISSIONS.LEADS_READ), adminLeadController.getLead)
  .put(requirePermission(PERMISSIONS.LEADS_WRITE), adminLeadController.updateLead);

// Lead notes endpoints
router.route('/:id/notes')
  .get(requirePermission(PERMISSIONS.LEADS_READ), adminLeadController.getLeadNotes)
  .post(requirePermission(PERMISSIONS.LEADS_WRITE), adminLeadController.createLeadNote);

// Lead history endpoint
router.route('/:id/history')
  .get(requirePermission(PERMISSIONS.LEADS_READ), adminLeadController.getLeadHistory);

module.exports = router;
