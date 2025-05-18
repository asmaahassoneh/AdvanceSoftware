
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/verifyToken');
const helpRequestController = require('../controllers/helpRequestController');

// 🔐 Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes
router.post('/', helpRequestController.createHelpRequest);
router.get('/all', helpRequestController.getAllHelpRequests);
router.get('/orphanage/:name', helpRequestController.getHelpRequestsByOrphanage);
router.put('/status/:id', helpRequestController.updateHelpRequestStatus);

module.exports = router;
