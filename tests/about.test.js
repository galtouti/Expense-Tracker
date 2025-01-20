const request = require('supertest');
const { app, server } = require('./setup');

describe('GET /api/about', () => {
  it('should return information about the team', async () => {
    const port = server.address().port; // Use the dynamic port
    const response = await request(`http://localhost:${port}`).get('/api/about');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((member) => {
      expect(member).toHaveProperty('first_name');
      expect(member).toHaveProperty('last_name');
    });
  });
});
