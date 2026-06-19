const express = require('express');
const router = express.Router();
const internshipController = require('../controllers/internshipController');

router.post(
  '/apply',
  (req, res, next) => {
    console.log('🔥 INTERNSHIP ROUTE HIT', {
      path: req.originalUrl,
      method: req.method,
      headers: { 'content-type': req.headers['content-type'] },
    });
    next();
  },
  internshipController.apply
);
router.get('/status/:applicationId', internshipController.getStatus);

module.exports = router;
