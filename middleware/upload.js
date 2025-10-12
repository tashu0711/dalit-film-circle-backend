const { upload } = require('../config/cloudinary');

// Single file upload middleware
exports.uploadSingle = upload.single('profilePhoto');

// Error handling middleware for multer
exports.handleUploadError = (err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 2MB allowed.'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload failed'
    });
  }
  next();
};