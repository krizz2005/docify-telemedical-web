const multer = require('multer');
const path = require('path');

// ➤ Storage: save to /uploads with auto-generated filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ➤ File Filter: only allow images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed'));
  }
};

// ➤ Limits: max 5 MB
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5 MB
  fileFilter,
});

module.exports = upload;
