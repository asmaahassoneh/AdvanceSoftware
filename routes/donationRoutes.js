const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const auth = require('../services/authMiddlewear'); 

router.post('/create', auth, donationController.createDonation);
router.get('/history', auth, donationController.getUserDonations);
router.get('/history/:id', auth, donationController.getDonationById);
router.put('/update/:id', auth, donationController.updateDonation);
router.delete('/delete/:id', auth, donationController.deleteDonation);

module.exports = router;
