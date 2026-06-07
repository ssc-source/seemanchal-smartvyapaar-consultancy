const express = require('express');
const router = express.Router();
const adminCommunityItemController = require('../controllers/adminCommunityItemController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.COMMUNITY_READ), adminCommunityItemController.getAllCommunityItems)
  .post(requirePermission(PERMISSIONS.COMMUNITY_WRITE), adminCommunityItemController.createCommunityItem);

router.route('/:id')
  .get(requirePermission(PERMISSIONS.COMMUNITY_READ), adminCommunityItemController.getCommunityItem)
  .put(requirePermission(PERMISSIONS.COMMUNITY_WRITE), adminCommunityItemController.updateCommunityItem)
  .delete(requirePermission(PERMISSIONS.COMMUNITY_WRITE), adminCommunityItemController.deleteCommunityItem);

module.exports = router;
