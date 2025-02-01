/**
 * @module tests/setup
 * @description Test environment setup and teardown configuration
 */

const mongoose = require('mongoose');
const app = require('../app');

/* Server instance for testing */
let server;

/**
 * Global setup before running tests
 * Connects to test database and starts test server
 * @async
 * @function beforeAll
 */
beforeAll(async () => {
  try {
    /* Connect to MongoDB test database */
    await mongoose.connect(process.env.MONGO_URI, { 
      dbName: 'test-db'
    });

    /* Ensure database connection is established */
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) {
        resolve();
      } else {
        mongoose.connection.once('connected', resolve);
      }
    });

    /* Clean up existing test data */
    if (mongoose.connection.db) {
      const collections = await mongoose.connection.db.collections();
      for (const collection of collections) {
        await collection.deleteMany({});
      }
    }

    /* Initialize test server on random port */
    return new Promise((resolve) => {
      server = app.listen(0, () => {
        console.log('Test server running');
        resolve();
      });
    });
  } catch (error) {
    console.error('Setup error:', error);
    throw error;
  }
});

/**
 * Global cleanup after all tests complete
 * Closes database connection and test server
 * @async
 * @function afterAll
 */
afterAll(async () => {
  try {
    /* Close database connection */
    if (mongoose.connection) {
      await mongoose.connection.close();
    }

    /* Shutdown test server */
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
});

/**
 * Export app and server instances for test files
 * @exports {Object} 
 * @property {Express} app - Express application instance
 * @property {http.Server} server - HTTP server instance
 */
module.exports = { app, server };
