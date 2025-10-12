const User = require('../models/User');
const jwt = require('jsonwebtoken');

const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register new member
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, department, languages, bio, portfolioLinks } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      department,
      languages,
      bio,
      portfolioLinks
    });

    // Send confirmation email to user
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Dalit Film Circle - Registration Confirmation',
        html: emailTemplates.signupConfirmation(user.name)
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the registration if email fails
    }

    // Send notification email to admin
    try {
      await sendEmail({
        email: process.env.ADMIN_NOTIFICATION_EMAIL,
        subject: 'New Member Registration - Approval Required',
        html: emailTemplates.adminNewMemberNotification(
          user.name,
          user.email,
          user.department,
          user.languages
        )
      });
    } catch (emailError) {
      console.error('Admin notification failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your account is pending admin approval.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user (include password field)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is approved
    if (!user.isApproved && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};