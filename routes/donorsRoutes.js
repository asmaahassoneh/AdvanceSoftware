const express = require('express');
const router = express.Router();
const { getDonorDashboard } = require('../controllers/donorController');
const { verifyToken } = require('../middleware/auth');

// Authenticated route (any user, but front-end will call for donors)
router.get('/dashboard',getDonorDashboard);

module.exports = router;
