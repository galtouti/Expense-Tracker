/**
 * @module routes/report
 * @description Express router handling expense report generation
 */

const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');
const User = require('../models/user');

/* Define valid expense categories */
const allowedCategories = ['food', 'health', 'housing', 'sport', 'education'];

/**
 * GET /report
 * @description Generates a monthly expense report grouped by categories
 * @param {Object} req.query - Query parameters
 * @param {string} req.query.id - User ID to generate report for
 * @param {string} req.query.year - Year of the report (YYYY)
 * @param {string} req.query.month - Month of the report (1-12)
 */
router.get('/', async (req, res) => {
  const { id, year, month } = req.query;

  /* Validate required parameters */
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
    /* Verify user exists */
    const user = await User.findOne({ id: id });
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user exists with the provided ID'
      });
    }

    /* Retrieve expenses for the specified period */
    const costs = await Cost.find({
      userid: id,
      $expr: {
        $and: [
          { $eq: [{ $year: "$date" }, parseInt(year)] },
          { $eq: [{ $month: "$date" }, parseInt(month)] }
        ]
      }
    }).sort('date');
    
    /* Initialize data structure for all categories */
    const costsByCategory = {};
    allowedCategories.forEach(category => {
      costsByCategory[category] = {
        expenses: [],
        totalSum: 0,
        count: 0
      };
    });

    /* Group expenses by category and calculate totals */
    costs.forEach(cost => {
      costsByCategory[cost.category].expenses.push({
        description: cost.description,
        sum: cost.sum,
        day: cost.date.getDate()
      });
      costsByCategory[cost.category].totalSum += cost.sum;
      costsByCategory[cost.category].count += 1;
    });

    /* Calculate summary statistics */
    const categoriesCount = Object.values(costsByCategory)
      .filter(category => category.totalSum > 0)
      .length;
    const totalExpensesCount = Object.values(costsByCategory)
      .reduce((acc, category) => acc + category.count, 0);
    const grandTotal = Object.values(costsByCategory)
      .reduce((acc, category) => acc + category.totalSum, 0);

    /* Format response object */
    const response = {
      userId: id,
      month: parseInt(month),
      year: parseInt(year),
      categories: Object.entries(costsByCategory).map(([category, data]) => ({
        category,
        expenses: data.expenses,
        categoryTotal: data.totalSum,
        expensesCount: data.count
      })),
      summary: {
        totalAmount: grandTotal,
        totalCategories: categoriesCount,
        totalExpenses: totalExpensesCount
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
