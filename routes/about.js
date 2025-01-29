const express = require('express');
const router = express.Router();

/**
 * Get development team information
 * @route GET /api/about
 * @returns {Object[]} 200 - Array of team members
 */
router.get('/about', (req, res) => {
  const teamMembers = [
    { 
      first_name: 'Gal', 
      last_name: 'Touti' 
    }
    // Add other team members here in the same format
  ];
  
  return res.status(200).json(teamMembers);
});

module.exports = router;