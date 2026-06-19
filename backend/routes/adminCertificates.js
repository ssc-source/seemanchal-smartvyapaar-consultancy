const express = require('express');
const router = express.Router();
const adminCertificateController = require('../controllers/adminCertificateController');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');

router.use(protect);

router.route('/')
  .get(requirePermission(PERMISSIONS.CERTIFICATES_READ), adminCertificateController.getAllCertificates)
  .post(requirePermission(PERMISSIONS.CERTIFICATES_WRITE), adminCertificateController.createCertificate);

router.route('/:id')
  .get(requirePermission(PERMISSIONS.CERTIFICATES_READ), adminCertificateController.getCertificate)
  .put(requirePermission(PERMISSIONS.CERTIFICATES_WRITE), adminCertificateController.updateCertificate)
  .delete(requirePermission(PERMISSIONS.CERTIFICATES_WRITE), adminCertificateController.deleteCertificate);

module.exports = router;
