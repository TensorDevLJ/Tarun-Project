
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  category: { type: String, required: true, trim: true },
  contactNumber: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  address: { type: String, required: true, trim: true },
  college: { type: String, required: true, trim: true },
  qualification: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  paymentDate: { type: Date, required: true },
  paymentRef: { type: String, required: true, trim: true },
  paymentReceiptPath: { type: String, required: true },
  applicationFormPath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
  approvedAt: { type: Date },
  rejected: { type: Boolean, default: false },
  rejectedAt: { type: Date },
  rejectionReason: { type: String, trim: true }
});

// Index for better query performance
registrationSchema.index({ email: 1 });
registrationSchema.index({ approved: 1 });
registrationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Registration', registrationSchema);
