const { Setting } = require('../models');
const catchAsync = require('../utils/catchAsync');

// Get all settings
exports.getAllSettings = catchAsync(async (req, res, next) => {
  const settings = await Setting.findAll();
  return res.status(200).json({ success: true, data: settings });
});

// Update a setting
exports.updateSetting = catchAsync(async (req, res, next) => {
  const { key } = req.params;
  const { value } = req.body;
  
  let setting = await Setting.findOne({ where: { key } });
  
  if (setting) {
    setting.value = value;
    await setting.save();
  } else {
    setting = await Setting.create({ key, value });
  }
  
  return res.status(200).json({ success: true, data: setting });
});

// Batch update settings
exports.batchUpdateSettings = catchAsync(async (req, res, next) => {
  const { settings } = req.body; // Array of { key, value }
  
  const results = [];
  for (const item of settings) {
    let setting = await Setting.findOne({ where: { key: item.key } });
    if (setting) {
      setting.value = item.value;
      await setting.save();
    } else {
      setting = await Setting.create({ key: item.key, value: item.value });
    }
    results.push(setting);
  }
  
  return res.status(200).json({ success: true, data: results });
});
