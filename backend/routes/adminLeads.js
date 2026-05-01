const express = require('express');
const router = express.Router();
const adminLeadController = require('../controllers/adminLeadController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(adminLeadController.getAllLeads);

router.route('/:id')
  .get(adminLeadController.getLead)
  .put(adminLeadController.updateLead);

module.exports = router;
