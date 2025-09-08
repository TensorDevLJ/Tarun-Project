const { body, validationResult } = require('express-validator');

// Registration validation rules
const registrationValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('contactNumber')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian mobile number'),
  
  body('gender')
    .isIn(['Male', 'Female', 'Other', 'Prefer not to say'])
    .withMessage('Please select a valid gender'),
  
  body('category')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Category must be between 2 and 50 characters'),
  
  body('address')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  
  body('college')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('College name must be between 2 and 200 characters'),
  
  body('qualification')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Qualification must be between 2 and 100 characters'),
  
  body('course')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Course name must be between 2 and 200 characters'),
  
  body('paymentDate')
    .isISO8601()
    .withMessage('Please provide a valid payment date'),
  
  body('paymentRef')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Payment reference must be between 5 and 100 characters'),
];

// Admin login validation
const adminLoginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  registrationValidation,
  adminLoginValidation,
  handleValidationErrors
};