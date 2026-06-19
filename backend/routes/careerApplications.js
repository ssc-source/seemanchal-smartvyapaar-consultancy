const express = require("express");
const router = express.Router();

router.use((req, res) => {
  console.warn('Deprecated legacy route /api/career-applications called.');
  return res.status(410).json({
    success: false,
    message: 'Legacy career application endpoint is deprecated. Use /api/internships/apply instead.',
  });
});

module.exports = router;
