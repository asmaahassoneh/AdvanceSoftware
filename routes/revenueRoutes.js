const express = require('express');
const router = express.Router();
const revenueReportController = require('../controllers/revenueReportController');

router.get('/report', revenueReportController.getRevenueReport);

module.exports = router;
