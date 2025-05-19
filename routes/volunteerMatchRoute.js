const express = require('express');
const router = express.Router();
const volunteerMatchController = require('../controllers/volunteerMatchController');


router.post('/match-volunteers', volunteerMatchController.matchVolunteers);

module.exports = router;
