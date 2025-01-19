const express = require('express');
const router = express.Router();
const Cost = require('../models/cost');

// דוח חודשי
router.get('/report', async (req, res) => {
  try {
    const { id, year, month } = req.query;
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(`${year}-${parseInt(month) + 1}-01`);

    const costs = await Cost.find({
      userid: id,
      date: { $gte: startDate, $lt: endDate },
    });

    res.json(costs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;