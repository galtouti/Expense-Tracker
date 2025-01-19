const express = require('express');
const router = express.Router();

// נקודת קצה לפרטי הצוות
router.get('/about', (req, res) => {
  res.json([
    { first_name: 'Gal', last_name: 'Touti' },
    { first_name: 'Teammate', last_name: 'Name' },
  ]);
});

module.exports = router;