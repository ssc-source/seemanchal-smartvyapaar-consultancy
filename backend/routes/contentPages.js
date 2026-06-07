const express = require('express');
const router = express.Router();
const contentPageController = require('../controllers/contentPageController');

router.get('/', contentPageController.getAllContentPages);
router.get('/privacy-policy', contentPageController.getPrivacyPolicy);
router.get('/terms-of-service', contentPageController.getTermsOfService);
router.get('/:slug', contentPageController.getContentPage);

module.exports = router;
