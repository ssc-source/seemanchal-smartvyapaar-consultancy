const express = require('express');
const router = express.Router();
const { upload } = require('../utils/upload');
const { protect } = require('../middlewares/authMiddleware');
const catchAsync = require('../utils/catchAsync');

router.use(protect);

router.post('/upload', upload.single('image'), catchAsync(async (req, res, next) => {
  if (req.fileValidationError) {
    return res.status(400).json({ success: false, message: req.fileValidationError });
  }
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image to upload' });
  }
  
  // Return the public URL for the uploaded file
  const fileUrl = `/uploads/${req.file.filename}`;
  
  return res.status(200).json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
}));

module.exports = router;
