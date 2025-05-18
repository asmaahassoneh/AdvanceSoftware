const express = require('express');
const router = express.Router();
const { chatWithOpenAI } = require('../controllers/chatController');

console.log('✅ chatRoutes.js is loaded');

router.post('/chat', (req, res, next) => {
  console.log('✅ /chatbot/chat route HIT');
  next();
}, chatWithOpenAI);

module.exports = router;
