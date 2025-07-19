const express = require('express');
const jwt = require('jsonwebtoken');
const UserStreak = require('../models/UserStreak');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

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

// Get user streak
router.get('/', authenticateToken, async (req, res) => {
  try {
    let streak = await UserStreak.findOne({ userId: req.user.userId });
    if (!streak) {
      streak = new UserStreak({ userId: req.user.userId });
      await streak.save();
    }
    res.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastPracticeDate: streak.lastPracticeDate,
      recentActivity: streak.recentActivity || [],
      badges: streak.badges || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper: check and award badges
async function checkAndAwardBadges(streak, userId) {
  // 7-day streak badge
  if (streak.currentStreak >= 7 && !streak.badges.includes('streak-7')) {
    streak.badges.push('streak-7');
  }
  // 100 messages badge (count from ChatMessage)
  const ChatMessage = require('../models/ChatMessage');
  const msgCount = await ChatMessage.countDocuments({ userId });
  if (msgCount >= 100 && !streak.badges.includes('messages-100')) {
    streak.badges.push('messages-100');
  }
  // First voice chat badge (check if any message with inputMode: 'voice')
  const hasVoice = await ChatMessage.exists({ userId, inputMode: 'voice' });
  if (hasVoice && !streak.badges.includes('voice-1')) {
    streak.badges.push('voice-1');
  }
}

// Update user streak
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { currentStreak, longestStreak, lastPracticeDate } = req.body;
    let streak = await UserStreak.findOne({ userId: req.user.userId });
    if (!streak) {
      streak = new UserStreak({ userId: req.user.userId });
    }
    if (currentStreak !== undefined) streak.currentStreak = currentStreak;
    if (longestStreak !== undefined) streak.longestStreak = longestStreak;
    if (lastPracticeDate !== undefined) streak.lastPracticeDate = new Date(lastPracticeDate);
    // Add today's date to recentActivity if not present
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString().slice(0, 10);
    if (!streak.recentActivity) streak.recentActivity = [];
    if (!streak.recentActivity.includes(todayISO)) {
      streak.recentActivity.push(todayISO);
    }
    // Keep only the last 7 days
    streak.recentActivity = streak.recentActivity.filter(dateStr => {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      return (today - d) / (1000 * 60 * 60 * 24) < 7;
    });
    // Check and award badges
    await checkAndAwardBadges(streak, req.user.userId);
    await streak.save();
    res.json({
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastPracticeDate: streak.lastPracticeDate,
      recentActivity: streak.recentActivity,
      badges: streak.badges,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user streak
router.delete('/all', authenticateToken, async (req, res) => {
  try {
    await UserStreak.deleteMany({ userId: req.user.userId });
    res.json({ message: 'User streak deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 