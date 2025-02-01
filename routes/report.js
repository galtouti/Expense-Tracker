const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');
const User = require('../models/user');

// Get the allowed categories from the Cost model
const ALLOWED_CATEGORIES = ['food', 'health', 'housing', 'sport', 'education'];

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
    
    // Initialize costsByCategory with all possible categories
    const costsByCategory = {};
    ALLOWED_CATEGORIES.forEach(category => {
      costsByCategory[category] = {
        expenses: [],
        totalSum: 0,
        count: 0
      };
    });

    // Add the actual costs to their respective categories
    costs.forEach(cost => {
      costsByCategory[cost.category].expenses.push({
        description: cost.description,
        sum: cost.sum,
        date: cost.date.toISOString().split('T')[0]
      });
      costsByCategory[cost.category].totalSum += cost.sum;
      costsByCategory[cost.category].count += 1;
    });

    // Calculate grand total and summary
    const categoriesCount = Object.values(costsByCategory)
      .filter(category => category.totalSum > 0)
      .length;
    const totalExpensesCount = Object.values(costsByCategory)
      .reduce((acc, category) => acc + category.count, 0);
    const grandTotal = Object.values(costsByCategory)
      .reduce((acc, category) => acc + category.totalSum, 0);

    // Prepare the response
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
