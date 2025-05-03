const express = require('express');
const router = express.Router();
const childReportController = require('../controllers/reportController');
const pdfReportController = require('../controllers/pdfReportController');

//PDF Report 
router.get('/userSummary', pdfReportController.createUserSummaryReport); 
router.get('/orphanageSummary', pdfReportController.createOrphanageReport);
router.get('/orphanSummary', pdfReportController.createOrphanStatisticsReport);
router.get('/SponsorshipSummary', pdfReportController.createSponsorshipReport);

//Child Report
router.post('/WriteReport', childReportController.addReport); 
router.put('/:id', childReportController.updateReport);     
router.delete('/:id', childReportController.deleteReport); 
router.get('/:name', childReportController.getReport); 
router.get('', childReportController.showAllReports); 


module.exports = router;


