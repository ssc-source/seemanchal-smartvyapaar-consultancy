const express = require('express');
const router = express.Router();
const adminSettingController = require('../controllers/adminSettingController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(adminSettingController.getAllSettings)
  .put(adminSettingController.batchUpdateSettings);

router.route('/:key')
  .put(adminSettingController.updateSetting);

module.exports = router;
