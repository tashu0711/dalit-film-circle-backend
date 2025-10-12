const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all approved members (Directory)
// @route   GET /api/members
// @access  Private (only approved members)
exports.getAllMembers = async (req, res) => {
  try {
    const { search, department, language } = req.query;
    
    let query = { isApproved: true, role: 'member' };

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // Case insensitive search
    }

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Filter by language
    if (language) {
      query.languages = { $in: [language] };
    }

    const members = await User.find(query)
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

// @desc    Get single member by ID
// @route   GET /api/members/:id
// @access  Private (approved members)
exports.getMemberById = async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update own profile
// @route   PUT /api/members/profile
// @access  Private (logged in member)
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      location: req.body.location,
      department: req.body.department,
      languages: req.body.languages,
      bio: req.body.bio,
      portfolioLinks: req.body.portfolioLinks
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete own account
// @route   DELETE /api/members/profile
// @access  Private
exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};



// @desc    Upload profile photo
// @route   POST /api/members/profile/photo
// @access  Private
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Update user profile with new photo URL
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: req.file.path }, // Cloudinary URL
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
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

// @desc    Delete profile photo
// @route   DELETE /api/members/profile/photo
// @access  Private
exports.deleteProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.profilePhoto || user.profilePhoto === 'default-avatar.png') {
      return res.status(400).json({
        success: false,
        message: 'No profile photo to delete'
      });
    }

    // Extract public_id from Cloudinary URL
    const urlParts = user.profilePhoto.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = `dalit-film-circle/profiles/${filename.split('.')[0]}`;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Update user profile
    user.profilePhoto = 'default-avatar.png';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};