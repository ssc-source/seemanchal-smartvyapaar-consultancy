const express = require('express');
const router = express.Router();

const { protect, requirePermission } = require('../middlewares/authMiddleware');
const adminSeoController = require('../controllers/adminSeoController');
const { PERMISSIONS } = require('../security/permissions');


router.use(protect);

router.route('/')
	.get(requirePermission(PERMISSIONS.CONTENT_READ), adminSeoController.getAll)
	.post(requirePermission(PERMISSIONS.CONTENT_WRITE), adminSeoController.create);

router.route('/:id')
	.get(requirePermission(PERMISSIONS.CONTENT_READ), adminSeoController.get)
	.put(requirePermission(PERMISSIONS.CONTENT_WRITE), adminSeoController.update)
	.delete(requirePermission(PERMISSIONS.CONTENT_WRITE), adminSeoController.remove);

module.exports = router;
