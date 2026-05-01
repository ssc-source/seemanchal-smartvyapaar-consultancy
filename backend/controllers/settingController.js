const { Setting } = require('../models');

// GET /api/settings
exports.getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.findAll();

    const data = {};
    settings.forEach((setting) => {
      data[setting.key] = setting.value;
    });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};