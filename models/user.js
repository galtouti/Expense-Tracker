const mongoose = require('mongoose');

/**
 * User Schema
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} first_name - User's first name
 * @property {string} last_name - User's last name
 * @property {Date} birthday - User's date of birth
 * @property {string} marital_status - User's marital status
 */
const userSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true,
    trim: true
  },
  first_name: { 
    type: String, 
    required: true,
    trim: true
  },
  last_name: { 
    type: String, 
    required: true,
    trim: true
  },
  birthday: { 
    type: Date, 
    required: true 
  },
  marital_status: { 
    type: String, 
    required: true,
    enum: ['single', 'married', 'divorced', 'widowed'],
    trim: true
  }
}, { 
  collection: 'users',
  timestamps: true,
  versionKey: false
});

// Ensure index is created
userSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);