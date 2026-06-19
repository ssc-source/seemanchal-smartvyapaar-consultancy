const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { upload } = require('../utils/upload');
const { protect, requirePermission } = require('../middlewares/authMiddleware');
const { PERMISSIONS } = require('../security/permissions');
const catchAsync = require('../utils/catchAsync');
const { Media } = require('../models');
const { Op } = require('sequelize');
const { recordAudit } = require('../utils/auditLogger');
const cloudinaryService = require('../services/cloudinaryService');

router.use(protect);

// List media assets (search, folder filter, pagination)
router.get('/', requirePermission(PERMISSIONS.MEDIA_UPLOAD), catchAsync(async (req, res) => {
  const q = req.query.q || null;
  const folder = req.query.folder || null;
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);
  const offset = (page - 1) * limit;

  const where = {};
  if (folder) where.folder = folder;
  if (q) {
    where[Op.or] = [
      { originalName: { [Op.like]: `%${q}%` } },
      { filename: { [Op.like]: `%${q}%` } },
      { altText: { [Op.like]: `%${q}%` } },
    ];
  }

  // Fallback to simple findAll with pagination
  const { count, rows } = await Media.findAndCountAll({ where, limit, offset, order: [['createdAt','DESC']] });

  return res.status(200).json({ success: true, data: rows, meta: { total: count, page, limit } });
}));

const handleUpload = catchAsync(async (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).json({ success: false, message: req.fileValidationError });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select an image to upload' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const uploadDir = path.join(__dirname, '..', 'public', 'uploads');

  const mediaData = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    path: fileUrl,
    altText: req.body.altText || null,
    uploadedBy: req.user ? req.user.id : null,
    url: fileUrl,
    storageProvider: 'local'
  };

  const created = await Media.create(mediaData);

  // Conditional Cloudinary upload
  if (process.env.MEDIA_STORAGE_PROVIDER === 'cloudinary' && cloudinaryService.configured()) {
    try {
      const savedPath = path.join(uploadDir, req.file.filename);
      const uploaded = await cloudinaryService.uploadImage(savedPath, { folder: req.body.folder });
      created.url = uploaded.url;
      created.publicId = uploaded.public_id || uploaded.publicId || uploaded.public_id;
      created.storageProvider = 'cloudinary';
      created.width = uploaded.width;
      created.height = uploaded.height;
      created.folder = req.body.folder || null;
      await created.save();
    } catch (e) {
      console.warn('[Media] Cloudinary upload failed:', e.message);
    }
  }

  // Record audit
  recordAudit({ userId: req.user ? req.user.id : null, action: 'media.upload', entityType: 'media', entityId: created.id, newValue: created.toJSON(), ipAddress: req.ip });

  return res.status(200).json({ success: true, data: created });
});

router.post('/', requirePermission(PERMISSIONS.MEDIA_UPLOAD), upload.single('image'), handleUpload);
router.post('/upload', requirePermission(PERMISSIONS.MEDIA_UPLOAD), upload.single('image'), handleUpload);

// Replace/update metadata or file
router.put('/:id', requirePermission(PERMISSIONS.MEDIA_UPLOAD), upload.single('image'), catchAsync(async (req, res) => {
  const media = await Media.findByPk(req.params.id);
  if (!media) return res.status(404).json({ success: false, message: 'Not found' });

  const old = media.toJSON();

  if (req.body.altText !== undefined) media.altText = req.body.altText;
  if (req.body.folder !== undefined) media.folder = req.body.folder;

  // Replace file if new file provided
  if (req.file) {
    const fileUrl = `/uploads/${req.file.filename}`;
    media.filename = req.file.filename;
    media.originalName = req.file.originalname;
    media.mimeType = req.file.mimetype;
    media.size = req.file.size;
    media.path = fileUrl;
    media.url = fileUrl;
    media.storageProvider = 'local';

    // If cloudinary enabled, replace remote
    if (process.env.MEDIA_STORAGE_PROVIDER === 'cloudinary' && cloudinaryService.configured()) {
      try {
        const savedPath = path.join(__dirname, '..', 'public', 'uploads', req.file.filename);
        const uploaded = await cloudinaryService.replaceImage(media.publicId, savedPath, { folder: req.body.folder });
        media.url = uploaded.url;
        media.publicId = uploaded.public_id || uploaded.publicId;
        media.storageProvider = 'cloudinary';
        media.width = uploaded.width;
        media.height = uploaded.height;
      } catch (e) {
        console.warn('[Media] Cloudinary replace failed:', e.message);
      }
    }
  }

  await media.save();
  recordAudit({ userId: req.user ? req.user.id : null, action: 'media.update', entityType: 'media', entityId: media.id, oldValue: old, newValue: media.toJSON(), ipAddress: req.ip });

  return res.status(200).json({ success: true, data: media });
}));

// Delete (soft delete can be implemented; here we remove record and remote)
router.delete('/:id', requirePermission(PERMISSIONS.MEDIA_UPLOAD), catchAsync(async (req, res) => {
  const media = await Media.findByPk(req.params.id);
  if (!media) return res.status(404).json({ success: false, message: 'Not found' });

  // Delete remote if present
  if (media.storageProvider === 'cloudinary' && media.publicId && cloudinaryService.configured()) {
    try { await cloudinaryService.deleteImage(media.publicId); } catch (e) { console.warn('[Media] Cloudinary delete failed:', e.message); }
  }

  await media.destroy();
  recordAudit({ userId: req.user ? req.user.id : null, action: 'media.delete', entityType: 'media', entityId: media.id, oldValue: media.toJSON(), ipAddress: req.ip });

  return res.status(200).json({ success: true, message: 'Deleted' });
}));

module.exports = router;
