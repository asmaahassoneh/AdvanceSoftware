const express = require('express');
const router = express.Router();
const { getDonorDashboard } = require('../controllers/donorController');
const { verifyToken } = require('../services/authService');

router.get('/dashboard', getDonorDashboard);

module.exports = router;