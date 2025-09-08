
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

// Index for better query performance
adminSchema.index({ email: 1 });

module.exports = mongoose.model('Admin', adminSchema);
