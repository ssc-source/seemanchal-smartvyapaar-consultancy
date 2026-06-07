const { HomepageSection } = require('../models');
const { getPagination, buildSearchWhere, buildOrder } = require('../utils/apiQuery');
const { recordAudit } = require('../utils/auditLogger');

// GET /api/admin/homepage-sections
exports.getAllSections = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const result = await HomepageSection.findAndCountAll({
      where: buildSearchWhere(req.query, ['sectionKey', 'title']),
      order: buildOrder(req.query, ['sectionKey', 'title', 'createdAt'], [['createdAt', 'ASC']]),
      limit,
      offset,
    });
    res.json({
      success: true,
      data: result.rows,
      meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) || 1 },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/homepage-sections/:id
exports.getSection = async (req, res, next) => {
  try {
    const section = await HomepageSection.findByPk(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    res.json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/homepage-sections
exports.createSection = async (req, res, next) => {
  try {
    const { sectionKey, title, content, isActive } = req.body;
    
    // Check if key already exists
    const existing = await HomepageSection.findOne({ where: { sectionKey } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Section key already exists' });
    }

    const section = await HomepageSection.create({ sectionKey, title, content, isActive });
    await recordAudit({
      userId: req.admin?.id || null,
      action: 'CREATE',
      entityType: 'HomepageSection',
      entityId: section.id,
      newValue: section.toJSON(),
      ipAddress: req.ip,
    });
    res.status(201).json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/homepage-sections/:id
exports.updateSection = async (req, res, next) => {
  try {
    const { sectionKey, title, content, isActive } = req.body;
    const section = await HomepageSection.findByPk(req.params.id);
    
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    // Check if updating to an existing key
    if (sectionKey && sectionKey !== section.sectionKey) {
      const existing = await HomepageSection.findOne({ where: { sectionKey } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Section key already exists' });
      }
    }

    const oldValue = section.toJSON();
    await section.update({ sectionKey, title, content, isActive });
    await recordAudit({
      userId: req.admin?.id || null,
      action: 'UPDATE',
      entityType: 'HomepageSection',
      entityId: section.id,
      oldValue,
      newValue: section.toJSON(),
      ipAddress: req.ip,
    });
    res.json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/homepage-sections/:id
exports.deleteSection = async (req, res, next) => {
  try {
    const section = await HomepageSection.findByPk(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }
    
    const oldValue = section.toJSON();
    await section.destroy();
    await recordAudit({
      userId: req.admin?.id || null,
      action: 'DELETE',
      entityType: 'HomepageSection',
      entityId: section.id,
      oldValue,
      ipAddress: req.ip,
    });
    res.json({ success: true, message: 'Section deleted successfully' });
  } catch (error) {
    next(error);
  }
};
