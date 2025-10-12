const express = require('express');
const router = express.Router();
const { uploadSingle, handleUploadError } = require('../middleware/upload');
const { uploadMemberPhoto } = require('../controllers/adminController');

const {
  getPendingMembers,
  approveMember,
  rejectMember,
  getAllMembersAdmin,
  updateMemberByAdmin,
  deleteMemberByAdmin,
  getCategories,
  updateCategories,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All routes need admin access
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);
router.get('/pending', getPendingMembers);
router.get('/members', getAllMembersAdmin);
router.put('/approve/:id', approveMember);
router.delete('/reject/:id', rejectMember);
router.put('/members/:id', updateMemberByAdmin);
router.delete('/members/:id', deleteMemberByAdmin);

// Categories management
router.route('/categories')
  .get(getCategories)
  .put(updateCategories);

module.exports = router;

router.post('/members/:id/photo', uploadSingle, handleUploadError, uploadMemberPhoto);