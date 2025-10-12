const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Password by default return nahi hoga queries mein
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department/Role is required'],
    enum: ['Director', 'Actor', 'Cinematographer', 'Editor', 'Writer', 'Producer', 'Sound Designer', 'Production Designer', 'Composer', 'Other']
  },
  languages: [{
    type: String,
    required: true
  }],
  bio: {
    type: String,
    maxlength: 500
  },
  portfolioLinks: [{
    type: String,
    trim: true
  }],
  profilePhoto: {
    type: String,
    default: 'default-avatar.png'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hash karna before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password match karne ka method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);