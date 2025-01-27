const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');

/**
 * @route GET /api/report
 * @description Get monthly report of costs grouped by category
 * @param {Object} req.query
 * @param {string} req.query.id - User ID
 * @param {string} req.query.year - Year for the report
 * @param {string} req.query.month - Month for the report (1-12)
 * @returns {Object[]} Array of costs grouped by category with totals
 * @throws {400} If required query parameters are missing
 * @throws {500} If server error occurs
 */
router.get('/report', async (req, res) => {
  const { id, year, month } = req.query;

  if (!id || !year || !month) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(`${year}-${parseInt(month) + 1}-01`);

    const costs = await Cost.aggregate([
      {
        $match: {
          userid: id,
          date: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          costs: { 
            $push: {
              description: '$description',
              sum: '$sum',
              date: '$date'
            }
          },
          total: { $sum: '$sum' }
        }
      },
      {
        $project: {
          category: '$_id',
          costs: 1,
          total: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
