const { HomepageSection } = require('../models');

// GET /api/admin/homepage-sections
exports.getAllSections = async (req, res, next) => {
  try {
    const sections = await HomepageSection.findAll();
    res.json({ success: true, data: sections });
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

    await section.update({ sectionKey, title, content, isActive });
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
    
    await section.destroy();
    res.json({ success: true, message: 'Section deleted successfully' });
  } catch (error) {
    next(error);
  }
};
