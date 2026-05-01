const express = require('express');
const router = express.Router();
const adminProjectController = require('../controllers/adminProjectController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(adminProjectController.getAllProjects)
  .post(adminProjectController.createProject);

router.route('/:id')
  .put(adminProjectController.updateProject)
  .delete(adminProjectController.deleteProject);

module.exports = router;
