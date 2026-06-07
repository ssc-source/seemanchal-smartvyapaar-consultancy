const { CommunityItem } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllCommunityItems = catchAsync(async (req, res) => {
  const items = await CommunityItem.findAll({
    where: { status: 'published' },
    order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']],
  });

  return res.status(200).json({ success: true, data: items });
});

exports.getCommunityItemById = catchAsync(async (req, res) => {
  const item = await CommunityItem.findOne({
    where: { id: req.params.id, status: 'published' },
  });

  if (!item) {
    return res.status(404).json({ success: false, message: 'Community item not found' });
  }

  return res.status(200).json({ success: true, data: item });
});
