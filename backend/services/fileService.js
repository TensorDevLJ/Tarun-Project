// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Ensure uploads folder exists
// const uploadDir = path.join(__dirname, "../uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const timestamp = Date.now();
//     cb(null, `${timestamp}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type"));
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
// });

// module.exports = { upload };
// services/fileService.js
const multer = require("multer");
const path = require("path");

// Store files locally for testing
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${file.fieldname}-${timestamp}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

module.exports = { upload };
