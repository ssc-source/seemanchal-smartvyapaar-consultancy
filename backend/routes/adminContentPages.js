const express = require('express');
const router = express.Router();
const adminContentPageController = require('../controllers/adminContentPageController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.CONTENT_READ), adminContentPageController.getAllContentPages)
  .post(requirePermission(PERMISSIONS.CONTENT_WRITE), adminContentPageController.createContentPage);

router.route('/:id')
  .get(requirePermission(PERMISSIONS.CONTENT_READ), adminContentPageController.getContentPage)
  .put(requirePermission(PERMISSIONS.CONTENT_WRITE), adminContentPageController.updateContentPage)
  .delete(requirePermission(PERMISSIONS.CONTENT_WRITE), adminContentPageController.deleteContentPage);

module.exports = router;
