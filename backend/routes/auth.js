
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { adminLoginValidation, handleValidationErrors } = require('../middleware/validation');

// Seed admin from env (only at first run if no admin exists)
router.post('/seed', async (req, res) => {
  try {
    const existing = await Admin.findOne({email:process.env.ADMIN_EMAIL});
    if (existing) {
      return res.json({ seeded: false, message: 'Admin already exists' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'adminpassword', salt);
    const adm = new Admin({
      email: process.env.ADMIN_EMAIL, 
      passwordHash: hash, 
      name: 'Admin'
    });
    await adm.save();
    
    res.json({ seeded: true, message: 'Admin created successfully' });
  } catch (e) {
    console.error('Admin seeding error:', e);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin login
router.post('/login', adminLoginValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: admin._id, email: admin.email }, 
      process.env.JWT_SECRET || 'secret', 
      { expiresIn: '12h' }
    );
    
    // Update last login
    await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });
    
    res.json({ 
      success: true, 
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify token
router.get('/verify', require('./middleware_auth'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-passwordHash');
    res.json({ success: true, admin });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
