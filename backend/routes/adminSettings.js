const express = require('express');
const router = express.Router();
const adminSettingController = require('../controllers/adminSettingController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.SETTINGS_READ), adminSettingController.getAllSettings)
  .put(requirePermission(PERMISSIONS.SETTINGS_WRITE), adminSettingController.batchUpdateSettings);

router.route('/:key')
  .put(requirePermission(PERMISSIONS.SETTINGS_WRITE), adminSettingController.updateSetting);

module.exports = router;
