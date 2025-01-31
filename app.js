require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Load routes
app.use("/api/costs", require("./routes/costs"));
app.use("/api/report", require("./routes/report"));
app.use("/api/users", require("./routes/users"));
app.use("/api/about", require("./routes/about"));

// Connect to MongoDB only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI, { dbName: 'expense-tracker' })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
