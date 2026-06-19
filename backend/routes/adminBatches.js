const express = require('express');
const router = express.Router();
const adminBatchController = require('../controllers/adminBatchController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.BATCHES_READ), adminBatchController.getAllBatches)
  .post(requirePermission(PERMISSIONS.BATCHES_WRITE), adminBatchController.createBatch);

router.route('/:id')
  .get(requirePermission(PERMISSIONS.BATCHES_READ), adminBatchController.getBatch)
  .put(requirePermission(PERMISSIONS.BATCHES_WRITE), adminBatchController.updateBatch)
  .delete(requirePermission(PERMISSIONS.BATCHES_WRITE), adminBatchController.deleteBatch);

module.exports = router;
