const express = require('express');
const router = express.Router();
const orphanController = require('../controllers/orphanController');

router.post('/registerOrphan', orphanController.registerOrphan)
router.get('/', orphanController.getAllOrphans);       
router.get('/:id', orphanController.getOrphanById);    
router.put('/:id', orphanController.updateOrphan);     
router.delete('/:id', orphanController.deleteOrphan); 

router.post('/:id/reports', orphanController.addReport); 
router.get('/reports/:name', orphanController.getReport); 
module.exports = router;


