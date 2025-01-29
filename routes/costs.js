const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');

// Add new cost item
router.post('/add', async (req, res) => {
  try {
    const { description, category, userid, sum, date } = req.body;

    // Validate required fields
    if (!description || !category || !userid || sum === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields. Please provide description, category, userid, and sum.' 
      });
    }

    // Validate sum is a positive number
    if (typeof sum !== 'number' || sum <= 0) {
      return res.status(400).json({ 
        error: 'Sum must be a positive number.' 
      });
    }

    // Create new cost item with today's date if no date provided
    const newCost = new Cost({ 
      description, 
      category, 
      userid, 
      sum,
      date: date || new Date()  // If date is not provided, use today's date
    });

    await newCost.save();
    res.status(201).json(newCost);
  } catch (error) {
    // Check if this is a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    res.status(500).json({ 
      error: 'Failed to add cost item: ' + error.message 
    });
  }
});

// Get all costs
router.get('/', async (req, res) => {
  try {
    const costs = await Cost.find();
    res.status(200).json(costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;