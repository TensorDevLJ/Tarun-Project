
const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
  email:String, passwordHash:String, name:String, createdAt:{type:Date, default:Date.now}
});
module.exports = mongoose.model('Admin', adminSchema);
