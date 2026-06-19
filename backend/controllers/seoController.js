const { SeoMetadata } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getByPageKey = catchAsync(async (req, res, next) => {
  const pageKey = req.params.pageKey;
  
  // Add 3s timeout for query
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      console.warn(`SEO query timeout after 3s for ${pageKey}`);
      return res.status(200).json({ success: true, data: null });
    }
  }, 3000);

  try {
    const entry = await SeoMetadata.findOne({ where: { pageKey, status: 'published' } });
    clearTimeout(timeoutId);
    if (!entry) return res.status(404).json({ success: false, message: 'SEO metadata not found' });
    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    clearTimeout(timeoutId);
    next(error);
  }
});

exports.getAll = catchAsync(async (req, res, next) => {
  const timeoutId = setTimeout(() => {
    if (!res.headersSent) {
      console.warn('SEO getAll timeout after 3s');
      return res.status(200).json({ success: true, data: [] });
    }
  }, 3000);

  try {
    const rows = await SeoMetadata.findAll({ order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']] });
    clearTimeout(timeoutId);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    clearTimeout(timeoutId);
    next(error);
  }
});
