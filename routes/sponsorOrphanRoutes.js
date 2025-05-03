const express = require('express');
const router = express.Router();
const sponsorController = require('../controllers/sponsorOrphanController'); 

router.post('/', sponsorController.sponsorOrphan);

module.exports = router;
