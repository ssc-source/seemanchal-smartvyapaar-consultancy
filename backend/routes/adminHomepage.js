const express = require('express');
const router = express.Router();
const adminHomepageController = require('../controllers/adminHomepageController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect); // All routes protected

router.route('/')
  .get(requirePermission(PERMISSIONS.HOMEPAGE_READ), adminHomepageController.getAllSections)
  .post(requirePermission(PERMISSIONS.HOMEPAGE_WRITE), adminHomepageController.createSection);

router.route('/:id')
  .get(requirePermission(PERMISSIONS.HOMEPAGE_READ), adminHomepageController.getSection)
  .put(requirePermission(PERMISSIONS.HOMEPAGE_WRITE), adminHomepageController.updateSection)
  .delete(requirePermission(PERMISSIONS.HOMEPAGE_WRITE), adminHomepageController.deleteSection);

module.exports = router;
