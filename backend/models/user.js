const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password_hash: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  date_of_birth: { type: Date },
  created_at: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);
