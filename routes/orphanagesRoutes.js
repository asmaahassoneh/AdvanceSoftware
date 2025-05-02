const express = require('express');
const router = express.Router();
const orphanagesController = require('../controllers/orphanagesController');

router.post('/addOrphanage', orphanagesController.addOrphanage) 
router.put('/:name', orphanagesController.updateOrphanage);     
router.delete('/:name', orphanagesController.deleteOrphanage); 
router.put('/verify/:name', orphanagesController.verifyOrhanage); 


module.exports = router;


