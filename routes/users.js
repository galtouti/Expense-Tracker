/**
 * @module routes/users
 * @description Express router handling user-related operations
 */

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cost = require('../models/cost');

/**
 * POST /users
 * @description Creates a new user in the system
 * @param {Object} req.body - The user data
 * @param {string} req.body.id - User's ID (minimum 5 digits)
 * @param {string} req.body.first_name - User's first name
 * @param {string} req.body.last_name - User's last name
 * @param {string} req.body.birthday - User's birthday in YYYY-MM-DD format
 * @param {string} req.body.marital_status - User's marital status
 */
router.post('/', async (req, res) => {
  try {
    const { id, first_name, last_name, birthday, marital_status } = req.body;
    
    /* Validate required fields */
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    if (!first_name) {
      return res.status(400).json({ error: 'First name is required' });
    }
    if (!last_name) {
      return res.status(400).json({ error: 'Last name is required' });
    }
    if (!birthday) {
      return res.status(400).json({ error: 'Birthday date is required' });
    }
    if (!marital_status) {
      return res.status(400).json({ error: 'Marital status is required' });
    }

    /* Validate ID format */
    if (!/^\d{5,}$/.test(id)) {
      return res.status(400).json({ error: 'Invalid ID - must be a number with at least 5 digits' });
    }

    /* Validate birthday format */
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      return res.status(400).json({ error: 'Invalid birth date format. Please use YYYY-MM-DD format' });
    }

    /* Parse and validate the date */
    const [year, month, day] = birthday.split('-').map(Number);
    const birthdayDate = new Date(year, month - 1, day);
    
    if (isNaN(birthdayDate.getTime()) || 
        birthdayDate.getFullYear() !== year || 
        birthdayDate.getMonth() !== month - 1 || 
        birthdayDate.getDate() !== day) {
      return res.status(400).json({ error: 'Invalid birth date' });
    }

    /* Check for existing user */
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this ID already exists' });
    }

    /* Create and save new user */
    const newUser = new User({
      id,
      first_name,
      last_name,
      birthday: birthdayDate,
      marital_status
    });
    await newUser.save();
    
    /* Format response */
    const response = newUser.toObject();
    response.birthday = birthday;
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /users/:id
 * @description Retrieves user details and their total expenses
 * @param {string} req.params.id - The user's ID to lookup
 */
router.get('/:id', async (req, res) => {
  try {
    /* Validate ID format */
    if (!/^\d{5,}$/.test(req.params.id)) {
      return res.status(400).json({ 
        error: 'Invalid ID format. The ID must be a number with at least 5 digits.' 
      });
    }

    /* Find user by ID */
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found. Please check if the ID is correct.' 
      });
    }

    /* Calculate total expenses for the user */
    const totalExpenses = await Cost.aggregate([
      { $match: { userid: req.params.id } },
      { $group: { _id: null, total: { $sum: "$sum" } } }
    ]);

    /* Format birthday to YYYY-MM-DD */
    const birthday = user.birthday.toISOString().split('T')[0];

    /* Send response with user details and total */
    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      birthday: birthday,
      marital_status: user.marital_status,
      total: totalExpenses.length > 0 ? totalExpenses[0].total : 0
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'An internal server error occurred. Please try again later.',
      details: err.message 
    });
  }
});

module.exports = router;
