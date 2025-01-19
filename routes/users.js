const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

// פרטי משתמש ספציפי
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const totalCosts = await Cost.aggregate([
      { $match: { userid: req.params.id } },
      { $group: { _id: null, total: { $sum: '$sum' } } },
    ]);

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total: totalCosts[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;