const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  departments: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Category', categorySchema);