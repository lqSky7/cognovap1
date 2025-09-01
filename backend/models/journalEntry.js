const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  entry_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true, ref: 'User' },
  title: { type: String },
  content: { type: String, required: true },
  mood_score: { type: Number, min: 1, max: 10 },
  sentiment_score: { type: Number },
  tags: [{ type: String }],
  accessible_in_chat: { type: Boolean, default: true },
  entry_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);
