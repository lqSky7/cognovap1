const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  conversation_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true, ref: 'User' },
  ai_therapist_id: { type: String, ref: 'User' }, // nullable
  title: { type: String },
  type: { type: String, enum: ['chat', 'therapy', 'crisis'], required: true },
  journal_access_enabled: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  last_message_at: { type: Date }
});

module.exports = mongoose.model('Conversation', conversationSchema);
