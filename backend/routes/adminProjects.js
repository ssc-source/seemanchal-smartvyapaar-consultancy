const express = require('express');
const router = express.Router();
const adminProjectController = require('../controllers/adminProjectController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.PROJECTS_READ), adminProjectController.getAllProjects)
  .post(requirePermission(PERMISSIONS.PROJECTS_WRITE), adminProjectController.createProject);

router.route('/:id')
  .put(requirePermission(PERMISSIONS.PROJECTS_WRITE), adminProjectController.updateProject)
  .delete(requirePermission(PERMISSIONS.PROJECTS_WRITE), adminProjectController.deleteProject);

module.exports = router;
