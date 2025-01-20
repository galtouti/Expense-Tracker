const mongoose = require('mongoose');
const app = require('../app');

let server;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { dbName: 'test-db' });
  server = app.listen(0, () => console.log('Test server running')); // Use dynamic port
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  server.close();
});

module.exports = { app, server };
