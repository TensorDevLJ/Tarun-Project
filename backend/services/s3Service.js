const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// S3 upload configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const timestamp = Date.now();
      const extension = file.originalname.split('.').pop();
      cb(null, `uploads/${file.fieldname}/${timestamp}-${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow only specific file types
    const allowedTypes = {
      'paymentReceipt': ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
      'applicationForm': ['application/pdf']
    };
    
    if (allowedTypes[file.fieldname] && allowedTypes[file.fieldname].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${allowedTypes[file.fieldname].join(', ')}`));
    }
  }
});

// Generate signed URL for file access
const getSignedUrl = (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: 3600 // URL expires in 1 hour
  };
  
  return s3.getSignedUrl('getObject', params);
};

module.exports = {
  upload,
  getSignedUrl,
  s3
};