const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Registration = require('../models/Registration');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// Use upload.fields for multiple files
const multi = upload.fields([
  { name: 'paymentReceipt', maxCount: 1 },
  { name: 'applicationForm', maxCount: 1 }
]);

router.post('/', (req, res) => {
  multi(req, res, async (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Upload error' });

    try {
      const data = req.body;

      // Create a new registration object
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
        paymentReceipt: req.files?.paymentReceipt?.[0]?.filename || '',
        applicationForm: req.files?.applicationForm?.[0]?.filename || ''
      });

      await reg.save();

      return res.json({ success: true, message: 'Registration saved', id: reg._id });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  });
});

module.exports = router;
