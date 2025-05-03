const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/WriteReport', reportController.addReport); 
router.put('/:id', reportController.updateReport);     
router.delete('/:id', reportController.deleteReport); 
router.get('/:name', reportController.getReport); 
router.get('', reportController.showAllReports); 

module.exports = router;


