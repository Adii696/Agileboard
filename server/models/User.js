const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // global role (fallback); per-project roles are in Project.members
  role: { type: String, enum: ['owner','editor','viewer'], default: 'viewer' }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
