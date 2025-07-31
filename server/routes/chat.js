const express = require('express');
const jwt = require('jsonwebtoken');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Save a chat message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, content, grammarFeedback, vocabularyTips, romanization, inputMode, sourceLanguage, targetLanguage, timestamp } = req.body;
    const chatMessage = new ChatMessage({
      userId: req.user.userId,
      type,
      content,
      grammarFeedback,
      vocabularyTips,
      romanization,
      inputMode,
      sourceLanguage,
      targetLanguage,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });
    await chatMessage.save();
    res.status(201).json({ message: 'Chat message saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Load chat history (last 20 messages for a language pair)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { sourceLanguage, targetLanguage } = req.query;
    const messages = await ChatMessage.find({
      userId: req.user.userId,
      sourceLanguage,
      targetLanguage,
    })
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(messages.reverse()); // oldest first
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete all chat messages for the user
router.delete('/all', authenticateToken, async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user.userId });
    res.json({ message: 'All chat history deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 