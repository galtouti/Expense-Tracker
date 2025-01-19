require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// טעינת המסלולים
app.use('/api', require('./routes/costs'));
app.use('/api', require('./routes/report'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/about'));

// חיבור ל-MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = app;