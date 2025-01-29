const mongoose = require('mongoose');
const app = require('../app');

let server;

/**
 * Clear all test data from the database
 */
async function clearDatabase() {
  const collections = ['costs', 'users'];
  for (const collection of collections) {
    if (mongoose.connection.collections[collection]) {
      await mongoose.connection.collections[collection].deleteMany({});
    }
  }
}

beforeAll(async () => {
  try {
    // Connect to MongoDB test database
    await mongoose.connect(process.env.MONGO_URI, { 
      dbName: 'expense-tracker-test'
    });

    // Wait for connection
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once('connected', resolve);
      }
    });

    // Clear test database
    await clearDatabase();

    // Start test server
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
    // Clear test database
    await clearDatabase();
    
    // Close MongoDB connection
    await mongoose.connection.close();

    // Close server
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
});

module.exports = { app, server };
