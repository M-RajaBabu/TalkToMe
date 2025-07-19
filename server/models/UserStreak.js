const mongoose = require('mongoose');

const UserStreakSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  currentStreak: { type: Number, default: 1 },
  longestStreak: { type: Number, default: 1 },
  lastPracticeDate: { type: Date, default: Date.now },
  recentActivity: { type: [String], default: [] }, // Array of ISO date strings
  badges: { type: [String], default: [] }, // Array of badge IDs/names
});

module.exports = mongoose.model('UserStreak', UserStreakSchema); 