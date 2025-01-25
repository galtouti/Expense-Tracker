const express = require('express');
const User = require('../models/user');
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

// בקשת GET לקבלת כל ההוצאות
router.get('/', async (req, res) => {
  try {
    const costs = await Cost.find();
    res.status(200).json(costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// בקשת POST ליצירת משתמש חדש
router.post('/users', async (req, res) => {
    const { id, first_name, last_name, birthday, marital_status } = req.body;

    const newUser = new User({
        id,
        first_name,
        last_name,
        birthday,
        marital_status,
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;