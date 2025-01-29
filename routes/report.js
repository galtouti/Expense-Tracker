const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');

// Monthly report endpoint with grouping by categories
router.get('/report', async (req, res) => {
  const { id, year, month } = req.query;

  if (!id || !year || !month) {
    return res.status(400).json({ error: 'Missing required parameters: id, year, and month are required' });
  }

  try {
    // Get all costs for the period
    const costs = await Cost.find({
      userid: id,
      $expr: {
        $and: [
          { $eq: [{ $year: "$date" }, parseInt(year)] },
          { $eq: [{ $month: "$date" }, parseInt(month)] }
        ]
      }
    }).sort('date');

    // Get category summaries
    const categorySummaries = await Cost.aggregate([
      {
        $match: {
          userid: id,
          $expr: {
            $and: [
              { $eq: [{ $year: "$date" }, parseInt(year)] },
              { $eq: [{ $month: "$date" }, parseInt(month)] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$category",
          sum: { $sum: "$sum" }
        }
      },
      {
        $project: {
          category: "$_id",
          sum: 1,
          _id: 0
        }
      }
    ]);

    // Calculate total sum
    const totalSum = categorySummaries.reduce((acc, curr) => acc + curr.sum, 0);

    // Prepare the response
    const response = {
      costs: costs.map(cost => ({
        description: cost.description,
        category: cost.category,
        sum: cost.sum,
        date: cost.date
      })),
      categorySummaries: categorySummaries,
      summary: {
        total: totalSum,
        categories: categorySummaries.map(cat => cat.category)
      }
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve monthly report: ' + error.message });
  }
});

module.exports = router;
