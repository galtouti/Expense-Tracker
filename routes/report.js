const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');

/**
 * Get monthly report of costs
 * @route GET /api/report
 * @param {string} id.query.required - User ID
 * @param {string} year.query.required - Report year
 * @param {string} month.query.required - Report month (1-12)
 * @returns {Object} 200 - Monthly report with costs grouped by category
 * @returns {Error} 400 - Missing parameters
 * @returns {Error} 500 - Server error
 */
router.get('/report', async (req, res) => {
  const { id, year, month } = req.query;

  if (!id || !year || !month) {
    return res.status(400).json({ 
      error: 'Missing required parameters: id, year, and month are mandatory' 
    });
  }

  try {
    // Create date range for the specified month
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    // Get costs grouped by category with original field names
    const costs = await Cost.aggregate([
      {
        $match: {
          userid: id,
          date: { 
            $gte: startDate, 
            $lte: endDate 
          }
        }
      },
      {
        $group: {
          _id: '$category',
          costs: {
            $push: {
              description: '$description',
              category: '$category',
              userid: '$userid',
              sum: '$sum',
              date: '$date'
            }
          }
        }
      },
      {
        $project: {
          category: '$_id',
          costs: 1,
          _id: 0
        }
      }
    ]);

    return res.status(200).json(costs);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

module.exports = router;
