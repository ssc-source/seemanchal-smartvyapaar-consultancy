const express = require("express");

const router = express.Router();

const {
  submitCommunityApplication,
} = require("../controllers/communityApplicationController");

router.post("/", submitCommunityApplication);

module.exports = router;