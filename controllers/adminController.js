const User = require('../models/User');
const Category = require('../models/Category');
const { cloudinary } = require('../config/cloudinary');

const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');

// @desc    Get all pending members (for approval)
// @route   GET /api/admin/pending
// @access  Private/Admin
exports.getPendingMembers = async (req, res) => {
  try {
    const pendingMembers = await User.find({ 
      isApproved: false,
      role: 'member' 
    })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingMembers.length,
      data: pendingMembers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// @desc    Approve member
// @route   PUT /api/admin/approve/:id
// @access  Private/Admin
exports.approveMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isApproved = true;
    await user.save();

    // Send approval confirmation email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Account Has Been Approved! 🎉',
        html: emailTemplates.approvalConfirmation(user.name)
      });
    } catch (emailError) {
      console.error('Approval email failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Member approved successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reject/Delete member
// @route   DELETE /api/admin/reject/:id
// @access  Private/Admin
exports.rejectMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send rejection email before deleting
    try {
      await sendEmail({
        email: user.email,
        subject: 'Application Status Update',
        html: emailTemplates.rejectionNotification(user.name)
      });
    } catch (emailError) {
      console.error('Rejection email failed:', emailError);
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Member rejected and removed'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all members (approved + pending)
// @route   GET /api/admin/members
// @access  Private/Admin
exports.getAllMembersAdmin = async (req, res) => {
  try {
    const members = await User.find({ role: 'member' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update any member profile (admin power)
// @route   PUT /api/admin/members/:id
// @access  Private/Admin
exports.updateMemberByAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete any member (admin power)
// @route   DELETE /api/admin/members/:id
// @access  Private/Admin
exports.deleteMemberByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get/Update Categories (Departments & Languages)
// @route   GET/PUT /api/admin/categories
// @access  Private/Admin
exports.getCategories = async (req, res) => {
  try {
    let categories = await Category.findOne();
    
    if (!categories) {
      // Default categories create karo agar nahi hai
      categories = await Category.create({
        departments: [
          'Director',
          'Actor',
          'Cinematographer',
          'Editor',
          'Writer',
          'Producer',
          'Sound Designer',
          'Production Designer',
          'Composer',
          'Costume Designer',
          'Makeup Artist',
          'Other'
        ],
        languages: [
          'Hindi',
          'Tamil',
          'Telugu',
          'Marathi',
          'Bengali',
          'Kannada',
          'Malayalam',
          'Gujarati',
          'Punjabi',
          'English'
        ]
      });
    }

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCategories = async (req, res) => {
  try {
    const { departments, languages } = req.body;

    let categories = await Category.findOne();
    
    if (categories) {
      categories.departments = departments || categories.departments;
      categories.languages = languages || categories.languages;
      categories.updatedAt = Date.now();
      await categories.save();
    } else {
      categories = await Category.create({ departments, languages });
    }

    res.status(200).json({
      success: true,
      message: 'Categories updated successfully',
      data: categories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member' });
    const approvedMembers = await User.countDocuments({ isApproved: true, role: 'member' });
    const pendingMembers = await User.countDocuments({ isApproved: false, role: 'member' });

    // Department wise count
    const departmentStats = await User.aggregate([
      { $match: { isApproved: true, role: 'member' } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Language wise count
    const languageStats = await User.aggregate([
      { $match: { isApproved: true, role: 'member' } },
      { $unwind: '$languages' },
      { $group: { _id: '$languages', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        approvedMembers,
        pendingMembers,
        departmentStats,
        languageStats
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload member photo (Admin)
// @route   POST /api/admin/members/:id/photo
// @access  Private/Admin
exports.uploadMemberPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { profilePhoto: req.file.path },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member photo uploaded successfully',
      data: {
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};