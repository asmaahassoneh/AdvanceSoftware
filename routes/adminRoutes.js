const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/registerOrphan', adminController.registerOrphan) 
router.put('/:id', adminController.updateOrphan);     
router.delete('/:id', adminController.deleteOrphan); 
router.post('/:id/reports', adminController.addReport); 

module.exports = router;


