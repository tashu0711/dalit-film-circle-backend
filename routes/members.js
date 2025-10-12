const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  updateProfile,
  deleteProfile,
  uploadProfilePhoto,
  deleteProfilePhoto
} = require('../controllers/memberController');
const { protect, approved } = require('../middleware/auth');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

// All routes are protected and need approval
router.use(protect);
router.use(approved);

router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.put('/profile', updateProfile);
router.delete('/profile', deleteProfile);

// Profile photo routes
router.post('/profile/photo', uploadSingle, handleUploadError, uploadProfilePhoto);
router.delete('/profile/photo', deleteProfilePhoto);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const {
//   getAllMembers,
//   getMemberById,
//   updateProfile,
//   deleteProfile
// } = require('../controllers/memberController');
// const { protect, approved } = require('../middleware/auth');

// // All routes are protected and need approval
// router.use(protect);
// router.use(approved);

// router.get('/', getAllMembers);
// router.get('/:id', getMemberById);
// router.put('/profile', updateProfile);
// router.delete('/profile', deleteProfile);

// module.exports = router;

