const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

// Add new user
router.post('/', async (req, res) => {
  try {
    const { id, first_name, last_name, birthday, marital_status } = req.body;
    
    // Validate required fields
    if (!id || !first_name || !last_name || !birthday || !marital_status) {
      return res.status(400).json({ error: 'כל השדות הם חובה' });
    }

    // Validate ID format (assuming ID should be numeric and at least 5 digits)
    if (!/^\d{5,}$/.test(id)) {
      return res.status(400).json({ error: 'מזהה לא תקין - צריך להיות מספר עם לפחות 5 ספרות' });
    }

    // Validate birthday
    const birthdayDate = new Date(birthday);
    if (isNaN(birthdayDate.getTime())) {
      return res.status(400).json({ error: 'תאריך לידה לא תקין' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(409).json({ error: 'משתמש עם מזהה זה כבר קיים' });
    }

    const newUser = new User({
      id,
      first_name,
      last_name,
      birthday: birthdayDate,
      marital_status
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user details and total cost
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalCosts = await Cost.aggregate([
      { $match: { userid: req.params.id } },
      { $group: { _id: null, total: { $sum: '$sum' } } },
    ]);

    const total = totalCosts.length > 0 ? totalCosts[0].total : 0;

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
