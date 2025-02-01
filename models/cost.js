const mongoose = require('mongoose');

const allowedCategories = ['food', 'health', 'housing', 'sport', 'education'];

const costSchema = new mongoose.Schema({
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true,
    minlength: [1, 'Description cannot be empty']
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: allowedCategories,
      message: 'Category must be one of: food, health, housing, sport, education'
    }
  },
  userid: { 
    type: String, 
    required: [true, 'User ID is required'],
    trim: true
  },
  sum: { 
    type: Number, 
    required: [true, 'Sum is required'],
    min: [0, 'Sum must be a positive number']
  },
  date: { 
    type: Date, 
    default: Date.now,
    validate: {
      validator: function(value) {
        return value instanceof Date && !isNaN(value);
      },
      message: 'Invalid date format'
    }
  }
});

// Add middleware to ensure sum is a positive number
costSchema.pre('save', function(next) {
  if (this.sum <= 0) {
    next(new Error('Sum must be a positive number'));
  }
  next();
});

module.exports = mongoose.model('Cost', costSchema);