const express = require('express');
const router = express.Router();
const controller = require('../controllers/emergencyCampaignController');

router.post('/create', controller.createCampaign);
router.get('/', controller.getAllCampaigns);
router.post('/contribute', controller.contributeToCampaign);
router.post('/notify', controller.notifyDonors);

module.exports = router;
