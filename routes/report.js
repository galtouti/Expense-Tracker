const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');
const User = require('../models/user');

// Monthly report endpoint with grouping by categories
router.get('/', async (req, res) => {
  const { id, year, month } = req.query;

  // Validate each required parameter individually
  if (!id) {
    return res.status(400).json({ 
      error: 'Missing user ID',
      message: 'Please provide a user ID to retrieve the report'
    });
  }

  if (!year) {
    return res.status(400).json({ 
      error: 'Missing year',
      message: 'Please specify the year for the report'
    });
  }

  if (!month) {
    return res.status(400).json({ 
      error: 'Missing month',
      message: 'Please specify the month for the report'
    });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ id: id });
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user exists with the provided ID'
      });
    }

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

    // Check if there are any costs for the selected month
    if (costs.length === 0) {
      return res.status(404).json({ 
        error: 'No data',
        message: `No expense data available for ${month}/${year}`
      });
    }
    
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
      status: 'success',
      data: {
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
      }
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error',
      message: 'An error occurred while retrieving the monthly report',
      details: error.message 
    });
  }
});

module.exports = router;
