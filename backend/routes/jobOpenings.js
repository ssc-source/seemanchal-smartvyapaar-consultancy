const express = require('express');
const router = express.Router();
const jobOpeningController = require('../controllers/jobOpeningController');

router.get('/', jobOpeningController.getAllJobOpenings);
router.get('/:id', jobOpeningController.getJobOpeningById);

module.exports = router;
