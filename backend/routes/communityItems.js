const express = require('express');
const router = express.Router();
const communityItemController = require('../controllers/communityItemController');

router.get('/', communityItemController.getAllCommunityItems);
router.get('/:id', communityItemController.getCommunityItemById);

module.exports = router;
