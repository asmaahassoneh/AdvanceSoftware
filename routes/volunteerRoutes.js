const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

router.post('/register', volunteerController.registerVolunteer);

module.exports = router;
