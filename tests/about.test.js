// about.test.js
const request = require('supertest');
const { app } = require('./setup');

describe('GET /api/about', () => {
  it('should return the team details', async () => {
    const res = await request(app).get('/api/about');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // Check for Gal Touti
    expect(res.body).toContainEqual({ first_name: 'Gal', last_name: 'Touti' });
    // Check for Sahar Abitbol
    expect(res.body).toContainEqual({ first_name: 'Sahar', last_name: 'Abitbol' });
  });
});
