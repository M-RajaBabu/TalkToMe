const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['user', 'ai'], required: true },
  content: { type: String, required: true },
  grammarFeedback: { type: String },
  vocabularyTips: { type: String },
  romanization: { type: String },
  inputMode: { type: String, default: 'text' },
  sourceLanguage: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema); 