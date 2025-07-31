const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const UserStreak = require('../models/UserStreak');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable

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

// Register
router.post('/register', async (req, res) => {
  const { name, phone, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, phone, email, password: hashed });
  await user.save();

  // Optionally, return name and phone in the response
  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, email: user.email, name: user.name, phone: user.phone });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, email: user.email });
});

// Delete user account and all related data
router.delete('/delete', authenticateToken, async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user.userId });
    await UserStreak.deleteMany({ userId: req.user.userId });
    await User.deleteOne({ _id: req.user.userId });
    res.json({ message: 'Account and all data deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change Email
router.post('/change-email', authenticateToken, async (req, res) => {
  const { newEmail } = req.body;
  if (!newEmail) return res.status(400).json({ message: 'New email required' });
  try {
    const existing = await User.findOne({ email: newEmail });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.email = newEmail;
    await user.save();
    res.json({ message: 'Email updated successfully', email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change Password
router.post('/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new password required' });
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 