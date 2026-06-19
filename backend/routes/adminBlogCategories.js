const express = require('express');
const router = express.Router();

// Lightweight placeholder to satisfy callers during stabilization
router.use((req, res) => {
  return res.status(200).json({ success: true, data: [] });
});

module.exports = router;
