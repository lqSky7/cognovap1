const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message_id: { type: String, required: true, unique: true },
  conversation_id: { type: String, required: true, ref: 'Conversation' },
  user_id: { type: String, required: true, ref: 'User' },
  sender: { type: String, enum: ['user', 'ai', 'ai_therapist'], required: true },
  content: { type: String, required: true },
  referenced_journal_entries: [{ type: String }], // Array of UUIDs
  sentiment_score: { type: Number },
  flagged_for_crisis: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
