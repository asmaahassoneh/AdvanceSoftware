const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');

router.post('/create', logisticsController.createPhysicalDonation);
router.patch('/status/:id', logisticsController.updateDeliveryStatus);
router.get('/deliveries', logisticsController.getAllDeliveries);

module.exports = router;
