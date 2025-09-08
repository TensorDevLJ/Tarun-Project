const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const { upload } = require('../services/s3Service');
const { sendRegistrationConfirmation } = require('../services/emailService');
const { registrationValidation, handleValidationErrors } = require('../middleware/validation');
const verifyRecaptcha = require('../middleware/recaptcha');

// Configure multer for multiple files
const multi = upload.fields([
  { name: 'paymentReceipt', maxCount: 1 },
  { name: 'applicationForm', maxCount: 1 }
]);

router.post('/', registrationValidation, handleValidationErrors, verifyRecaptcha, (req, res) => {
  multi(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ 
        success: false, 
        message: err.message || 'File upload error' 
      });
    }

    try {
      const data = req.body;

      // Check if email already exists
      const existingRegistration = await Registration.findOne({ email: data.email });
      if (existingRegistration) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered. Please use a different email address.'
        });
      }

      // Create registration object
      const reg = new Registration({
        fullName: data.fullName,
        gender: data.gender,
        category: data.category,
        contactNumber: data.contactNumber,
        email: data.email,
        address: data.address,
        college: data.college,
        qualification: data.qualification,
        course: data.course,
        paymentDate: data.paymentDate,
        paymentRef: data.paymentRef,
        paymentReceiptPath: req.files?.paymentReceipt?.[0]?.location || '',
        applicationFormPath: req.files?.applicationForm?.[0]?.location || ''
      });

      await reg.save();

      // Send confirmation email
      try {
        await sendRegistrationConfirmation(data.email, data.fullName, reg._id);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the registration if email fails
      }

      return res.json({ success: true, message: 'Registration saved', id: reg._id });
    } catch (e) {
      console.error(e);
      if (e.code === 11000) {
        return res.status(400).json({ success: false, message: 'Duplicate registration detected' });
      }
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });
});

module.exports = router;
