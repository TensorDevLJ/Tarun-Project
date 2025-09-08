// const express = require('express');
// const router = express.Router();
// const Registration = require('../models/Registration');
// const { upload } = require('../services/s3Service');
// const { sendRegistrationConfirmation } = require('../services/emailService');
// const { registrationValidation, handleValidationErrors } = require('../middleware/validation');
// const verifyRecaptcha = require('../middleware/recaptcha');

// // Configure multer for multiple files
// const multi = upload.fields([
//   { name: 'paymentReceipt', maxCount: 1 },
//   { name: 'applicationForm', maxCount: 1 }
// ]);

// router.post('/', registrationValidation, handleValidationErrors, verifyRecaptcha, (req, res) => {
//   multi(req, res, async (err) => {
//     if (err) {
//       console.error('Upload error:', err);
//       return res.status(500).json({ 
//         success: false, 
//         message: err.message || 'File upload error' 
//       });
//     }

//     try {
//       const data = req.body;

//       // Check if email already exists
//       const existingRegistration = await Registration.findOne({ email: data.email });
//       if (existingRegistration) {
//         return res.status(400).json({
//           success: false,
//           message: 'Email already registered. Please use a different email address.'
//         });
//       }

//       // Create registration object
//       const reg = new Registration({
//         fullName: data.fullName,
//         gender: data.gender,
//         category: data.category,
//         contactNumber: data.contactNumber,
//         email: data.email,
//         address: data.address,
//         college: data.college,
//         qualification: data.qualification,
//         course: data.course,
//         paymentDate: data.paymentDate,
//         paymentRef: data.paymentRef,
//         paymentReceiptPath: req.files?.paymentReceipt?.[0]?.location || '',
//         applicationFormPath: req.files?.applicationForm?.[0]?.location || ''
//       });

//       await reg.save();

//       // Send confirmation email
//       try {
//         await sendRegistrationConfirmation(data.email, data.fullName, reg._id);
//       } catch (emailError) {
//         console.error('Email sending failed:', emailError);
//         // Don't fail the registration if email fails
//       }

//       return res.json({ success: true, message: 'Registration saved', id: reg._id });
//     } catch (e) {
//       console.error(e);
//       if (e.code === 11000) {
//         return res.status(400).json({ success: false, message: 'Duplicate registration detected' });
//       }
//       return res.status(500).json({ success: false, message: 'Server error' });
//     }
//   });
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Registration = require('../models/Registration');
// const { upload } = require('../services/fileService'); // <-- updated import
// const { sendRegistrationConfirmation } = require('../services/emailService');
// const { registrationValidation, handleValidationErrors } = require('../middleware/validation');
// const verifyRecaptcha = require('../middleware/recaptcha');

// // Configure multer for multiple files
// const multi = upload.fields([
//   { name: 'paymentReceipt', maxCount: 1 },
//   { name: 'applicationForm', maxCount: 1 }
// ]);

// router.post('/', registrationValidation, handleValidationErrors, verifyRecaptcha, (req, res) => {
//   multi(req, res, async (err) => {
//     if (err) {
//       console.error('Upload error:', err);
//       return res.status(500).json({ 
//         success: false, 
//         message: err.message || 'File upload error' 
//       });
//     }

//     try {
//       const data = req.body;

//       // Check if email already exists
//       const existingRegistration = await Registration.findOne({ email: data.email });
//       if (existingRegistration) {
//         return res.status(400).json({
//           success: false,
//           message: 'Email already registered. Please use a different email address.'
//         });
//       }

//       // Create registration object
//       const reg = new Registration({
//         fullName: data.fullName,
//         gender: data.gender,
//         category: data.category,
//         contactNumber: data.contactNumber,
//         email: data.email,
//         address: data.address,
//         college: data.college,
//         qualification: data.qualification,
//         course: data.course,
//         paymentDate: data.paymentDate,
//         paymentRef: data.paymentRef,
//         paymentReceiptPath: req.files?.paymentReceipt?.[0]?.path || '',
//         applicationFormPath: req.files?.applicationForm?.[0]?.path || ''
//       });

//       await reg.save();

//       // Send confirmation email
//       try {
//         await sendRegistrationConfirmation(data.email, data.fullName, reg._id);
//       } catch (emailError) {
//         console.error('Email sending failed:', emailError);
//       }

//       return res.json({ success: true, message: 'Registration saved', id: reg._id });
//     } catch (e) {
//       console.error(e);
//       if (e.code === 11000) {
//         return res.status(400).json({ success: false, message: 'Duplicate registration detected' });
//       }
//       return res.status(500).json({ success: false, message: 'Server error' });
//     }
//   });
// });

// module.exports = router;



// routes/register.js

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const Registration = require("../models/Registration");
const { upload } = require("../services/fileService"); // local file upload
const { sendRegistrationConfirmation } = require("../services/emailService");

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Configure multer for multiple files
const multi = upload.fields([
  { name: "paymentReceipt", maxCount: 1 },
  { name: "applicationForm", maxCount: 1 },
]);

router.post("/", (req, res) => {
  multi(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }

    try {
      const data = req.body;

      // Check duplicate email
      const existing = await Registration.findOne({ email: data.email });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email already registered. Use a different email.",
        });
      }

      // Save registration
      const reg = new Registration({
        ...data,
        paymentReceiptPath: req.files?.paymentReceipt?.[0]?.path || "",
        applicationFormPath: req.files?.applicationForm?.[0]?.path || "",
      });

      await reg.save();

      // Send confirmation email (optional, works if emailService is configured)
      try {
        await sendRegistrationConfirmation(data.email, data.fullName, reg._id);
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr);
      }

      return res.json({ success: true, id: reg._id });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });
});

module.exports = router;
