const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

/**
 * @route GET /api/users/:id
 * @description Get user details and their total costs
 * @param {string} req.params.id - User ID
 * @returns {Object} User details including first_name, last_name, id and total costs
 * @throws {404} If user not found
 * @throws {500} If server error occurs
 */
router.get('/users/:id', async (req, res) => {
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
