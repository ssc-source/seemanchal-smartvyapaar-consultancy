const express = require('express');
const router = express.Router();
const adminServiceController = require('../controllers/adminServiceController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/')
  .get(adminServiceController.getAllServices)
  .post(adminServiceController.createService);

router.route('/:id')
  .put(adminServiceController.updateService)
  .delete(adminServiceController.deleteService);

module.exports = router;
