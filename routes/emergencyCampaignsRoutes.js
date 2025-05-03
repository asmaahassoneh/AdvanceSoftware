const express = require('express');
const router = express.Router();
const emergencyCampaignController = require('../controllers/emergencyCampaignController');

router.post('/create', emergencyCampaignController.createCampaign);
router.get('/', emergencyCampaignController.getAllCampaigns);
router.post('/contribute', emergencyCampaignController.contributeToCampaign);

module.exports = router;
