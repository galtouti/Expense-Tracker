const express = require('express');
const router = express.Router();

// Team details endpoint
router.get('/', (req, res) => {
  res.json([
    { first_name: 'Gal', last_name: 'Touti' },
    { first_name: 'Sahar', last_name: 'Abitbol' },
  ]);
});

module.exports = router;