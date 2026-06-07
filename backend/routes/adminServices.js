const express = require('express');
const router = express.Router();
const adminServiceController = require('../controllers/adminServiceController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.SERVICES_READ), adminServiceController.getAllServices)
  .post(requirePermission(PERMISSIONS.SERVICES_WRITE), adminServiceController.createService);

router.route('/:id')
  .put(requirePermission(PERMISSIONS.SERVICES_WRITE), adminServiceController.updateService)
  .delete(requirePermission(PERMISSIONS.SERVICES_WRITE), adminServiceController.deleteService);

module.exports = router;
