
const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const auth = require('./middleware_auth');
const { generateCertificate } = require('../services/certificateService');
const { sendApprovalNotification } = require('../services/emailService');
const { getSignedUrl } = require('../services/s3Service');

// Get all registrations with pagination and filtering
router.get('/registrations', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // 'approved', 'pending', 'all'
    const search = req.query.search;
    
    let query = {};
    
    // Filter by approval status
    if (status === 'approved') {
      query.approved = true;
    } else if (status === 'pending') {
      query.approved = false;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } }
      ];
    }
    
    const total = await Registration.countDocuments(query);
    const registrations = await Registration.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);
    
    // Generate signed URLs for file access
    const registrationsWithUrls = registrations.map(reg => {
      const regObj = reg.toObject();
      if (regObj.paymentReceiptPath) {
        regObj.paymentReceiptUrl = getSignedUrl(regObj.paymentReceiptPath.split('/').pop());
      }
      if (regObj.applicationFormPath) {
        regObj.applicationFormUrl = getSignedUrl(regObj.applicationFormPath.split('/').pop());
      }
      return regObj;
    });
    
    res.json({
      success: true,
      data: registrationsWithUrls,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get registration statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments();
    const approvedRegistrations = await Registration.countDocuments({ approved: true });
    const pendingRegistrations = await Registration.countDocuments({ approved: false });
    
    // Course-wise statistics
    const courseStats = await Registration.aggregate([
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Monthly registration trends
    const monthlyStats = await Registration.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalRegistrations,
        approved: approvedRegistrations,
        pending: pendingRegistrations,
        courseStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Approve a registration
router.post('/registrations/:id/approve', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const reg = await Registration.findByIdAndUpdate(
      id, 
      { approved: true, approvedAt: new Date() }, 
      { new: true }
    );
    
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    
    // Send approval notification email
    try {
      await sendApprovalNotification(reg.email, reg.fullName, reg._id);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the approval if email fails
    }
    
    res.json({ success: true, data: reg });
  } catch (error) {
    console.error('Error approving registration:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Reject a registration
router.post('/registrations/:id/reject', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;
    
    const reg = await Registration.findByIdAndUpdate(
      id, 
      { 
        approved: false, 
        rejected: true, 
        rejectionReason: reason,
        rejectedAt: new Date() 
      }, 
      { new: true }
    );
    
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    
    res.json({ success: true, data: reg });
  } catch (error) {
    console.error('Error rejecting registration:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Generate and download certificate
router.get('/registrations/:id/certificate', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const reg = await Registration.findById(id);
    
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    
    if (!reg.approved) {
      return res.status(400).json({ 
        success: false, 
        message: 'Certificate can only be generated for approved registrations' 
      });
    }
    
    const pdfBuffer = await generateCertificate(reg);
    const filename = `certificate-${reg.fullName.replace(/\s+/g, '_')}-${id}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ success: false, message: 'Certificate generation failed' });
  }
});

// Delete a registration
router.delete('/registrations/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const reg = await Registration.findByIdAndDelete(id);
    
    if (!reg) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    
    res.json({ success: true, message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
