const express = require('express');
const router = express.Router();
const adminUserImportController = require('../controllers/adminUserImportController');
const adminUserManualAddController = require('../controllers/adminUserManualAddController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/import-csv', authMiddleware.requireAdmin, (req, res, next) => {
  upload.single('csv')(req, res, (err) => {
    if (err) return next(err);
    adminUserImportController.importUsersFromCSV(req, res, next);
  });
});

router.get('/imports', authMiddleware.requireAdmin, adminUserImportController.listImports);

router.post('/add-manual', authMiddleware.requireAdmin, adminUserManualAddController.addUserManual);

module.exports = router;
