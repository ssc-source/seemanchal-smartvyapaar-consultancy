const express = require('express');
const router = express.Router();
const adminHomepageController = require('../controllers/adminHomepageController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // All routes protected

router.route('/')
  .get(adminHomepageController.getAllSections)
  .post(adminHomepageController.createSection);

router.route('/:id')
  .get(adminHomepageController.getSection)
  .put(adminHomepageController.updateSection)
  .delete(adminHomepageController.deleteSection);

module.exports = router;
