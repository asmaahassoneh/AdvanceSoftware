const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/WriteReport', reportController.addReport); 
router.get('/:name', reportController.getReport); 
module.exports = router;


