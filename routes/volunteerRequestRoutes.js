const express = require('express');
const router = express.Router();
const volunteerRequestController = require('../controllers/volunteerRequestController');

router.post('/', volunteerRequestController.postRequest);
router.get('/', volunteerRequestController.getOpenRequests);

module.exports = router;
