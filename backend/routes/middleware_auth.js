
const jwt = require('jsonwebtoken');
module.exports = function(req,res,next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({message:'Missing token'});
  const parts = auth.split(' ');
  if(parts.length !==2) return res.status(401).json({message:'Invalid token'});
  const token = parts[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.admin = payload;
    next();
  }catch(e){ return res.status(401).json({message:'Invalid token'}); }
};
