const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');

// הוספת הוצאה חדשה
router.post('/add', async (req, res) => {
  try {
    const { description, category, userid, sum, date } = req.body;
    const newCost = new Cost({ description, category, userid, sum, date });
    await newCost.save();
    res.status(201).json(newCost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;