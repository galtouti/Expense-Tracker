const request = require('supertest');
const { app } = require('./setup');

describe('GET /api/about', () => {
  it('should return team members information', async () => {
    const response = await request(app)
      .get('/api/about');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    response.body.forEach(member => {
      expect(member).toHaveProperty('first_name');
      expect(member).toHaveProperty('last_name');
      expect(Object.keys(member).length).toBe(2);
      expect(typeof member.first_name).toBe('string');
      expect(typeof member.last_name).toBe('string');
    });
  });
});
