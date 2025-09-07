
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// seed admin from env (only at first run if no admin exists)
router.post('/seed', async (req,res)=>{
  try{
    const existing = await Admin.findOne({email:process.env.ADMIN_EMAIL});
    if(existing) return res.json({seeded:false, message:'already'});
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'adminpassword', salt);
    const adm = new Admin({email: process.env.ADMIN_EMAIL, passwordHash: hash, name:'Admin'});
    await adm.save();
    res.json({seeded:true});
  }catch(e){console.error(e); res.status(500).json({error:'err'});}
});

router.post('/login', async (req,res)=>{
  const {email, password} = req.body;
  const admin = await Admin.findOne({email});
  if(!admin) return res.status(401).json({success:false, message:'Invalid credentials'});
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if(!ok) return res.status(401).json({success:false, message:'Invalid credentials'});
  const token = jwt.sign({id: admin._id, email: admin.email}, process.env.JWT_SECRET || 'secret', {expiresIn:'12h'});
  res.json({success:true, token});
});

module.exports = router;
