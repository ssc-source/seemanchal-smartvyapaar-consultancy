const { JobOpening } = require('../models');
const catchAsync = require('../utils/catchAsync');

exports.getAllJobOpenings = catchAsync(async (req, res) => {
  const openings = await JobOpening.findAll({
    where: { status: 'published' },
    order: [['displayOrder', 'ASC'], ['createdAt', 'ASC']],
  });

  return res.status(200).json({ success: true, data: openings });
});

exports.getJobOpeningById = catchAsync(async (req, res) => {
  const opening = await JobOpening.findOne({
    where: { id: req.params.id, status: 'published' },
  });

  if (!opening) {
    return res.status(404).json({ success: false, message: 'Job opening not found' });
  }

  return res.status(200).json({ success: true, data: opening });
});
