const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');

router.get('/', seoController.getAll);
router.get('/:pageKey', seoController.getByPageKey);

module.exports = router;
