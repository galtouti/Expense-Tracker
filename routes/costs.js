/**
 * @module routes/costs
 * @description Express router handling cost-related operations
 */

const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');
const User = require('../models/user');

/**
 * POST /costs/add
 * @description Creates a new cost entry in the system
 * @param {Object} req.body - The cost data
 * @param {string} req.body.description - Description of the cost
 * @param {string} req.body.category - Category of the cost (food, health, housing, sport, education)
 * @param {string} req.body.userid - ID of the user who made the expense
 * @param {number} req.body.sum - Amount spent
 * @param {string} [req.body.date] - Date of the expense (optional, defaults to current date)
 */
router.post('/add', async (req, res) => {
  try {
    const { description, category, userid, sum, date } = req.body;

    /* Validate required fields presence */
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    if (!userid) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    /* Validate sum presence and format */
    if (sum === undefined || sum === null || sum === '') {
      return res.status(400).json({ error: 'Sum is required and cannot be empty' });
    }
    
    /* Validate sum is numeric and positive */
    const numericSum = Number(sum);
    if (isNaN(numericSum)) {
      return res.status(400).json({ error: 'Sum must be a valid number' });
    }
    if (numericSum <= 0) {
      return res.status(400).json({ error: 'Sum must be a positive number' });
    }

    /* Validate description is not empty */
    if (description.trim().length === 0) {
      return res.status(400).json({ error: 'Description cannot be empty' });
    }

    /* Validate category is allowed */
    const allowedCategories = ['food', 'health', 'housing', 'sport', 'education'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ 
        error: 'Invalid category. Category must be one of: food, health, housing, sport, education' 
      });
    }

    /* Validate date format if provided */
    if (date) {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
    }

    /* Verify user exists */
    const userExists = await User.findOne({ id: userid });
    if (!userExists) {
      return res.status(404).json({ error: 'User does not exist in the system' });
    }

    /* Create and save new cost entry */
    const newCost = new Cost({ 
      description, 
      category, 
      userid, 
      sum,
      date: date || new Date()
    });

    await newCost.save();
    res.status(201).json(newCost);
  } catch (error) {
    /* Handle mongoose validation errors */
    if (error.name === 'ValidationError') {
      const errorMessage = Object.values(error.errors)
        .map(err => err.message)
        .join(', ');
      return res.status(400).json({ error: errorMessage });
    }
    
    res.status(500).json({ 
      error: 'Failed to add cost item: ' + error.message 
    });
  }
});

/**
 * GET /costs
 * @description Retrieves all cost entries from the system
 */
router.get('/', async (req, res) => {
  try {
    const costs = await Cost.find();
    res.status(200).json(costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;