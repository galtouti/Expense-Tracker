const express = require('express');
const router = express.Router();

/**
 * @route GET /api/about
 * @description Get development team members information
 * @returns {Object[]} Array of team members with first_name and last_name only
 */
router.get('/about', (req, res) => {
  res.json([
    { first_name: 'Gal', last_name: 'Touti' },
    { first_name: 'Teammate', last_name: 'Name' }
  ]);
});

module.exports = router;