const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: [true, 'ID is required'],
    trim: true,
    index: true
  },
  first_name: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    minlength: [1, 'First name cannot be empty']
  },
  last_name: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [1, 'Last name cannot be empty']
  },
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

module.exports = mongoose.model('User', userSchema);