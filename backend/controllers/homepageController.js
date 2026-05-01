const { HomepageSection } = require('../models');

// GET /api/homepage-sections
exports.getHomepageSections = async (req, res, next) => {
  try {
    const sections = await HomepageSection.findAll({
      where: { isActive: true }
    });
    
    // Map them into a simpler object structure keyed by sectionKey
    const data = {};
    sections.forEach(sec => {
      data[sec.sectionKey] = sec.content;
    });

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
