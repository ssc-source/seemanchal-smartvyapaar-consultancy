const express = require("express");
const router = express.Router();

const {
  submitCareerApplication,
} = require("../controllers/careerApplicationController");

router.post("/", submitCareerApplication);

module.exports = router;
