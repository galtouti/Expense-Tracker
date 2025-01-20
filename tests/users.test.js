const request = require('supertest');
const { app, server } = require('./setup');
const User = require('../models/user');

beforeEach(async () => {
  await User.create({
    id: '123123',
    first_name: 'mosh',
    last_name: 'israeli',
    birthday: '1990-01-01',
    marital_status: 'single',
  });
});

describe('GET /api/users/:id', () => {
  it('should return user details and total cost', async () => {
    const port = server.address().port; // Use the dynamic port
    const response = await request(`http://localhost:${port}`).get('/api/users/123123');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('first_name', 'mosh');
    expect(response.body).toHaveProperty('last_name', 'israeli');
    expect(response.body).toHaveProperty('id', '123123');
    expect(response.body).toHaveProperty('total');
  });

  it('should return an error for a non-existent user', async () => {
    const port = server.address().port; // Use the dynamic port
    const response = await request(`http://localhost:${port}`).get('/api/users/invalid_id');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});
