const express = require('express');
const router = express.Router();
const adminJobOpeningController = require('../controllers/adminJobOpeningController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.JOBS_READ), adminJobOpeningController.getAllJobOpenings)
  .post(requirePermission(PERMISSIONS.JOBS_WRITE), adminJobOpeningController.createJobOpening);

router.route('/:id')
  .get(requirePermission(PERMISSIONS.JOBS_READ), adminJobOpeningController.getJobOpening)
  .put(requirePermission(PERMISSIONS.JOBS_WRITE), adminJobOpeningController.updateJobOpening)
  .delete(requirePermission(PERMISSIONS.JOBS_WRITE), adminJobOpeningController.deleteJobOpening);

module.exports = router;
