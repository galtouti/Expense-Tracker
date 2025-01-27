const mongoose = require('mongoose');
const app = require('../app');

let server;

beforeAll(async () => {
  try {
    // Connect to MongoDB and wait for it to be ready
    await mongoose.connect(process.env.MONGO_URI, { 
      dbName: 'expense-tracker-test'
    });

    // Wait for connection to be fully established
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once('connected', resolve);
      }
    });

    // Clear all collections at the start of tests
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      for (const collection of collections) {
        await collection.deleteMany({});
      }
    }

    // Start server
    return new Promise((resolve) => {
      server = app.listen(0, () => {
        console.log('Test server running on expense-tracker-test database');
        resolve();
      });
    });
  } catch (error) {
    console.error('Setup error:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Close MongoDB connection
    if (mongoose.connection) {
      await mongoose.connection.close();
    }

    // Close server if it exists
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
});

module.exports = { app, server };
