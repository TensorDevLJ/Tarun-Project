// // backend/services/s3Service.js

// require("dotenv").config();
// const AWS = require("aws-sdk");
// const multer = require("multer");
// const multerS3 = require("multer-s3");

// // ✅ Validate required environment variables
// if (!process.env.AWS_ACCESS_KEY_ID ||
//     !process.env.AWS_SECRET_ACCESS_KEY ||
//     !process.env.AWS_REGION ||
//     !process.env.S3_BUCKET_NAME) {
//   throw new Error("❌ Missing AWS S3 configuration in .env file");
// }

// // Configure AWS SDK
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();

// // Configure Multer-S3 storage
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.S3_BUCKET_NAME,
//     acl: "private", // change to "public-read" if you want public URLs
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       const timestamp = Date.now();
//       cb(null, `uploads/${file.fieldname}/${timestamp}-${file.originalname}`);
//     },
//   }),
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10 MB
//   },
//   fileFilter: function (req, file, cb) {
//     const allowedTypes = {
//       paymentReceipt: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
//       applicationForm: ["application/pdf"],
//     };

//     if (allowedTypes[file.fieldname] && allowedTypes[file.fieldname].includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(
//         new Error(
//           `Invalid file type for ${file.fieldname}. Allowed types: ${allowedTypes[file.fieldname]?.join(", ") || "None"}`
//         )
//       );
//     }
//   },
// });

// // Generate signed URL for temporary access to private files
// const getSignedUrl = (key) => {
//   const params = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: key,
//     Expires: 3600, // 1 hour
//   };
//   return s3.getSignedUrl("getObject", params);
// };

// module.exports = {
//   upload,
//   getSignedUrl,
//   s3,
// };


const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer local storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files inside backend/uploads
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Invalid file type. Only JPG, PNG, PDF allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = { upload };
