const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
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
    validate: {
      validator: function(value) {
        return value instanceof Date && !isNaN(value);
      },
      message: 'Invalid date format'
    }
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

const About = mongoose.model('About', aboutSchema);

// Initialize default data if not exists
const initializeData = async () => {
  try {
    const count = await About.countDocuments();
    if (count === 0) {
      await About.create([
        {
          id: "123456789",
          first_name: "Gal",
          last_name: "Touti",
          birthday: new Date("1990-01-01"),
          marital_status: "single"
        },
        {
          id: "987654321",
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

// Initialize data when the module is loaded
initializeData();

// Team details endpoint - returns only first and last names
router.get('/', async (req, res) => {
  try {
    const team = await About.find({}, 'first_name last_name -_id');
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team details" });
  }
});

module.exports = router;