const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');

/**
 * @route POST /api/add
 * @description Add a new cost item to the database
 * @param {Object} req.body
 * @param {string} req.body.description - Description of the cost
 * @param {('food'|'health'|'housing'|'sport'|'education')} req.body.category - Category of the cost
 * @param {string} req.body.userid - ID of the user
 * @param {number} req.body.sum - Amount of the cost
 * @param {string} [req.body.date] - Optional date of the cost (ISO format)
 * @returns {Object} JSON object of the created cost
 * @throws {400} If required fields are missing or invalid
 * @throws {500} If server error occurs
 */
router.post('/add', async (req, res) => {
  try {
    const { description, category, userid, sum, date } = req.body;
    
    // Validate required fields
    if (!description || !category || !userid || !sum) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create cost object with optional date
    const costData = {
      description,
      category,
      userid,
      sum,
      ...(date && { date: new Date(date) })
    };

    const newCost = new Cost(costData);
    await newCost.save();
    res.status(201).json(newCost);
  } catch (error) {
    // Handle validation errors separately
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;