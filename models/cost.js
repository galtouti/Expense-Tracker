const mongoose = require('mongoose');

/**
 * Cost Schema
 * @typedef {Object} Cost
 * @property {string} description - Cost description
 * @property {string} category - Cost category (food, health, housing, sport, education)
 * @property {string} userid - ID of the user who made the cost
 * @property {number} sum - Cost amount
 * @property {Date} date - Date when the cost was made
 */
const costSchema = new mongoose.Schema({
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ['food', 'health', 'housing', 'sport', 'education']
  },
  userid: { 
    type: String, 
    required: true,
    index: true
  },
  sum: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  collection: 'costs',
  timestamps: true 
});

module.exports = mongoose.model('Cost', costSchema);