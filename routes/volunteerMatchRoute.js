const express = require('express');
const router = express.Router();
const volunteerMatchController = require('../controllers/volunteerMatchController');

// Route: POST /api/match-volunteers
router.post('/match-volunteers', volunteerMatchController.matchVolunteers);

module.exports = router;
