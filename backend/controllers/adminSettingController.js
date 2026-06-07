const { Setting } = require('../models');
const catchAsync = require('../utils/catchAsync');
const { getPagination, buildSearchWhere, buildOrder } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');

// Get all settings
exports.getAllSettings = catchAsync(async (req, res, next) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await Setting.findAndCountAll({
    where: buildSearchWhere(req.query, ['key', 'value']),
    order: buildOrder(req.query, ['key', 'createdAt', 'updatedAt'], [['key', 'ASC']]),
    limit,
    offset,
  });
  return res.status(200).json({
    success: true,
    data: result.rows,
    meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
  });
});

// Update a setting
exports.updateSetting = catchAsync(async (req, res, next) => {
  const { key } = req.params;
  const { value } = req.body;
  
  let setting = await Setting.findOne({ where: { key } });
  
  if (setting) {
    const oldValue = setting.toJSON();
    setting.value = value;
    await setting.save();
    await recordAudit({
      userId: req.admin?.id || null,
      action: 'UPDATE',
      entityType: 'Setting',
      entityId: setting.key,
      oldValue,
      newValue: setting.toJSON(),
      ipAddress: req.ip,
    });
  } else {
    setting = await Setting.create({ key, value });
    await recordAudit({
      userId: req.admin?.id || null,
      action: 'CREATE',
      entityType: 'Setting',
      entityId: setting.key,
      newValue: setting.toJSON(),
      ipAddress: req.ip,
    });
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
      const oldValue = setting.toJSON();
      setting.value = item.value;
      await setting.save();
      await recordAudit({
        userId: req.admin?.id || null,
        action: 'UPDATE',
        entityType: 'Setting',
        entityId: setting.key,
        oldValue,
        newValue: setting.toJSON(),
        ipAddress: req.ip,
      });
    } else {
      setting = await Setting.create({ key: item.key, value: item.value });
      await recordAudit({
        userId: req.admin?.id || null,
        action: 'CREATE',
        entityType: 'Setting',
        entityId: setting.key,
        newValue: setting.toJSON(),
        ipAddress: req.ip,
      });
    }
    results.push(setting);
  }
  
  return res.status(200).json({ success: true, data: results });
});
