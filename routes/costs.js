const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');

/**
 * Add a new cost item
 * @route POST /api/add
 * @param {string} description.body.required - Cost description
 * @param {string} category.body.required - Cost category (food/health/housing/sport/education)
 * @param {string} userid.body.required - User ID
 * @param {number} sum.body.required - Cost amount
 * @param {string} [date] - Optional cost date (if not provided, current date will be used)
 * @returns {Object} 201 - Created cost item
 * @returns {Error} 400 - Validation error
 * @returns {Error} 500 - Server error
 */
router.post('/add', async (req, res) => {
  try {
    const { description, category, userid, sum } = req.body;
    
    // Validate required fields
    if (!description || !category || !userid || !sum) {
      return res.status(400).json({ 
        error: 'Missing required fields: description, category, userid, and sum are mandatory' 
      });
    }

    // Create cost object (date will default to current time if not provided)
    const newCost = new Cost({
      description,
      category,
      userid,
      sum,
      ...(req.body.date ? { date: new Date(req.body.date) } : {})
    });

    // Save and return the exact document that was added to the collection
    const savedCost = await newCost.save();
    const response = savedCost.toObject();
    
    // Remove MongoDB specific fields
    delete response.__v;
    delete response._id;

    return res.status(201).json(response);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;