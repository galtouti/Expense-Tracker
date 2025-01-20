const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

// Get user details and total cost
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }); // Adjusted to `findOne`
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
