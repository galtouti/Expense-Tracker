/**
 * @module models/cost
 * @description Cost model schema definition and validation for expense tracking
 */

const mongoose = require('mongoose');

/* List of valid expense categories */
const allowedCategories = ['food', 'health', 'housing', 'sport', 'education'];

/**
 * Cost Schema - Defines the structure for expense documents
 * @typedef {Object} CostSchema
 */
const costSchema = new mongoose.Schema({
  /* Detailed description of the expense */
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    trim: true,
    minlength: [1, 'Description cannot be empty']
  },
  /* Category of the expense (must be one of the allowed categories) */
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: allowedCategories,
      message: 'Category must be one of: food, health, housing, sport, education'
    }
  },
  /* ID of the user who made the expense */
  userid: { 
    type: String, 
    required: [true, 'User ID is required'],
    trim: true
  },
  /* Amount of money spent */
  sum: { 
    type: Number, 
    required: [true, 'Sum is required'],
    min: [0, 'Sum must be a positive number'],
    max: [1000000000, 'Sum must be les then 1000000000']
  },
  /* Date when the expense occurred */
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

/**
 * Middleware to validate sum before saving
 * @param {Function} next - The next middleware function
 */
costSchema.pre('save', function(next) {
  if (this.sum <= 0) {
    next(new Error('Sum must be a positive number'));
  }
  next();
});

/**
 * Exports the Cost model
 * @type {mongoose.Model}
 */
module.exports = mongoose.model('Cost', costSchema);