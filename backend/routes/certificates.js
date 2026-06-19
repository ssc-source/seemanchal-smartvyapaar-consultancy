const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Create certificate (used after quiz pass)
router.post('/create', certificateController.createCertificate);

router.get('/verify/:certificateId', certificateController.verifyCertificate);
router.get('/:certificateId/download', requireAuth, certificateController.downloadCertificate);
router.get('/student', requireAuth, certificateController.getStudentCertificates);

module.exports = router;
