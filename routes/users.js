const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

/**
 * Get user details and total costs
 * @route GET /api/users/:id
 * @param {string} id.path.required - User ID
 * @returns {Object} 200 - User details with total costs
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Server error
 */
router.get('/users/:id', async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findOne({ 
      id: req.params.id 
    });

    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Calculate total costs for user
    const totalCosts = await Cost.aggregate([
      { 
        $match: { 
          userid: req.params.id 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { 
            $sum: '$sum' 
          } 
        } 
      }
    ]);

    // Return exactly the required fields
    return res.status(200).json({
      first_name: user.first_name,
      last_name: user.last_name,
      id: user.id,
      total: totalCosts.length > 0 ? totalCosts[0].total : 0
    });
  } catch (err) {
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;
