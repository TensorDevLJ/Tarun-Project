
const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Admin = require('../models/Admin');
const auth = require('./middleware_auth');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// get all registrations (protected)
router.get('/registrations', auth, async (req,res)=>{
  const regs = await Registration.find().sort({createdAt:-1});
  res.json({success:true, data: regs});
});

// approve a registration
router.post('/registrations/:id/approve', auth, async (req,res)=>{
  const id = req.params.id;
  const reg = await Registration.findByIdAndUpdate(id, {approved:true}, {new:true});
  res.json({success:true, data: reg});
});

// generate certificate PDF for a registration (protected)
router.get('/registrations/:id/certificate', auth, async (req,res)=>{
  const id = req.params.id;
  const reg = await Registration.findById(id);
  if(!reg) return res.status(404).json({success:false,message:'Not found'});

  const doc = new PDFDocument({size:'A4'});
  const filename = `certificate-${id}.pdf`;
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', 'application/pdf');

  doc.fontSize(20).text('Certificate of Completion', {align:'center'});
  doc.moveDown(2);
  doc.fontSize(14).text(`This is to certify that`, {align:'center'});
  doc.moveDown(1);
  doc.fontSize(18).text(`${reg.fullName}`, {align:'center', underline:true});
  doc.moveDown(1);
  doc.fontSize(12).text(`has successfully registered for the course: ${reg.course}`, {align:'center'});
  doc.moveDown(2);
  doc.fontSize(10).text(`Date: ${new Date().toLocaleDateString()}`, {align:'right'});
  doc.end();
  doc.pipe(res);
});

module.exports = router;
