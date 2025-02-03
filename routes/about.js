/**
 * @module routes/about
 * @description Express router handling team member information
 */

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * About Schema - Defines the structure for team member information
 * @typedef {Object} AboutSchema
 */
const aboutSchema = new mongoose.Schema({
  /* Team member's unique identification number */
  id: { 
    type: String, 
    required: [true, 'ID is required'],
    trim: true,
    index: true
  },
  /* Team member's first name */
  first_name: { 
    type: String, 
    required: [true, 'First name is required'],
    trim: true,
    minlength: [1, 'First name cannot be empty']
  },
  /* Team member's last name */
  last_name: { 
    type: String, 
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [1, 'Last name cannot be empty']
  },
  /* Team member's date of birth */
  birthday: { 
    type: Date, 
    required: [true, 'Birthday date is required'],
    validate: {
      validator: function(value) {
        return value instanceof Date && !isNaN(value);
      },
      message: 'Invalid date format'
    }
  },
  /* Team member's marital status */
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
 * About model for team member information
 * @type {mongoose.Model}
 */
const About = mongoose.model('About', aboutSchema);

/**
 * Initializes default team member data if the collection is empty
 * @async
 * @function initializeData
 */
const initializeData = async () => {
  try {
    const count = await About.countDocuments();
    if (count === 0) {
      await About.create([
        {
          id: "206785867",
          first_name: "Gal",
          last_name: "Touti",
          birthday: new Date("1998-10-08"),
          marital_status: "single"
        },
        {
          id: "207700923",
          first_name: "Sahar",
          last_name: "Abitbol",
          birthday: new Date("1990-01-01"),
          marital_status: "single"
        }
      ]);
    }
  } catch (error) {
    console.error('Error initializing about data:', error);
  }
};

/* Initialize data when the module is loaded */
initializeData();

/**
 * GET /about
 * @description Retrieves the list of team members (first and last names only)
 */
router.get('/', async (req, res) => {
  try {
    const team = await About.find({}, 'first_name last_name -_id');
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team details" });
  }
});

module.exports = router;