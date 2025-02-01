/**
 * @module models/user
 * @description User model schema definition and validation
 */

const mongoose = require('mongoose');

/**
 * User Schema - Defines the structure for user documents
 * @typedef {Object} UserSchema
 */
const userSchema = new mongoose.Schema({
  /* User's unique identification number */
  id: { 
    type: String, 
    required: [true, 'ID is required'],
    trim: true,
    index: true
  },
  /* User's first name */
  first_name: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    minlength: [1, 'First name cannot be empty'],
    maxlength: [100, 'First name cannot be longer than 30 characters'],
    validate: {
      validator: function(value) {
        return /^[A-Za-zא-ת\s]+$/.test(value);
      },
      message: 'First name can only contain letters'
    }
  },
  /* User's last name */
  last_name: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [1, 'Last name cannot be empty'],
    maxlength: [100, 'Last name cannot be longer than 30 characters'],
    validate: {
      validator: function(value) {
        return /^[A-Za-zא-ת\s]+$/.test(value);
      },
      message: 'Last name can only contain letters'
    }
  },
  /* User's date of birth with validation */
  birthday: { 
    type: Date, 
    required: [true, 'Birthday date is required'],
    validate: [
      {
        validator: function(value) {
          return value instanceof Date && !isNaN(value);
        },
        message: 'Invalid date format'
      },
      {
        validator: function(value) {
          return value <= new Date();
        },
        message: 'Birthday date cannot be in the future'
      }
    ]
  },
  /* User's marital status with predefined options */
  marital_status: { 
    type: String, 
    required: [true, 'Marital status is required'],
    trim: true,
    enum: {
      values: ['single', 'married', 'divorced', 'widowed'],
      message: 'Marital status must be one of the following: single, married, divorced, widowed'
    }
  }
});

/**
 * Exports the User model
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('User', userSchema);