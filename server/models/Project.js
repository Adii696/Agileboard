const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner','editor','viewer'], default: 'viewer' }
  }]
}, { timestamps: true });
module.exports = mongoose.model('Project', ProjectSchema);
