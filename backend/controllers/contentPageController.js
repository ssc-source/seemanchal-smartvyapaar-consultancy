const { ContentPage } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllContentPages = catchAsync(async (req, res) => {
  const pages = await ContentPage.findAll({
    where: { status: 'published' },
    order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']],
  });

  return res.status(200).json({ success: true, data: pages });
});

exports.getContentPage = catchAsync(async (req, res) => {
  const page = await ContentPage.findOne({
    where: { slug: req.params.slug, status: 'published' },
  });

  if (!page) {
    return res.status(404).json({ success: false, message: 'Content page not found' });
  }

  return res.status(200).json({ success: true, data: page });
});

exports.getPrivacyPolicy = catchAsync(async (req, res) => {
  const page = await ContentPage.findOne({
    where: { slug: 'privacy-policy', status: 'published' },
  });

  if (!page) {
    return res.status(404).json({ success: false, message: 'Privacy policy not found' });
  }

  return res.status(200).json({ success: true, data: page.content });
});

exports.getTermsOfService = catchAsync(async (req, res) => {
  const page = await ContentPage.findOne({
    where: { slug: 'terms-of-service', status: 'published' },
  });

  if (!page) {
    return res.status(404).json({ success: false, message: 'Terms of service not found' });
  }

  return res.status(200).json({ success: true, data: page.content });
});
