const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../services/authMiddlewear'); // ✅ Correct path

router.post('/', auth, donationController.createDonation);
router.get('/', auth, donationController.getUserDonations);

module.exports = router;
