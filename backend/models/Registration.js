
const mongoose = require('mongoose');
const registrationSchema = new mongoose.Schema({
  fullName: String, gender: String, category: String, contactNumber: String,
  email: String, address: String, college:String, qualification:String, course:String,
  paymentDate:String, paymentRef:String, paymentReceiptPath:String, applicationFormPath:String,
  createdAt:{type:Date, default:Date.now}, approved:{type:Boolean, default:false}
});
module.exports = mongoose.model('Registration', registrationSchema);
