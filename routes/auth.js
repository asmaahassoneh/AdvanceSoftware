const express = require('express');
const { registerUser, loginUser, resetPassword, logoutUser,verifyEmail } = require('../controllers/authController');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/reset-password', resetPassword);
router.get('/verify-email', verifyEmail);
module.exports = router;