/**
 * @module app
 * @description Main application entry point and configuration
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

/* Initialize Express application */
const app = express();

/* Configure middleware */
app.use(express.json());

/* Register API routes */
app.use("/api", require("./routes/costs"));
app.use("/api/report", require("./routes/report"));
app.use("/api/users", require("./routes/users"));
app.use("/api/about", require("./routes/about"));

/* Database connection */
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI, { dbName: 'expense-tracker' })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

  /* Server initialization */
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

/**
 * Export Express application for testing and external use
 * @type {express.Application}
 */
module.exports = app;
