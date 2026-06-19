const { HomepageSection } = require('../models');

// GET /api/homepage-sections with 3s timeout
exports.getHomepageSections = async (req, res, next) => {
  try {
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        console.warn('Homepage query timeout after 3s, returning empty data');
        return res.json({ success: true, data: {} });
      }
    }, 3000);

    const sections = await HomepageSection.findAll({
      where: { isActive: true }
    });
    
    clearTimeout(timeoutId);

    // Map them into a simpler object structure keyed by sectionKey
    const data = {};
    sections.forEach(sec => {
      data[sec.sectionKey] = sec.content;
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching homepage sections:', error.message);
    next(error);
  }
};
