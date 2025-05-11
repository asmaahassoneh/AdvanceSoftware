const express = require('express');
const router = express.Router();
const { deleteAccount } = require('../controllers/accountController');

router.delete('/delete/:userId', deleteAccount);

module.exports = router;
