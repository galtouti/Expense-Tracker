const request = require('supertest');
const { app } = require('./setup');
const Cost = require('../models/cost');

describe('GET /api/report', () => {
  beforeEach(async () => {
    // Add some test costs
    await Cost.create({
      description: 'Test expense',
      category: 'food',
      userid: '123123',
      sum: 50,
      date: new Date('2025-01-15')
    });
  });

  afterEach(async () => {
    await Cost.deleteMany({});
  });

  it('should return costs and summary for a specific user, year, and month', async () => {
    const response = await request(app)
      .get('/api/report?id=123123&year=2025&month=1');
    
    expect(response.statusCode).toBe(200);
    
    // Check response structure
    expect(response.body).toHaveProperty('costs');
    expect(response.body).toHaveProperty('summary');
    
    // Check costs array
    expect(Array.isArray(response.body.costs)).toBe(true);
    if (response.body.costs.length > 0) {
      const category = response.body.costs[0];
      expect(category).toHaveProperty('category');
      expect(category).toHaveProperty('items');
      expect(category).toHaveProperty('total');
      
      if (category.items.length > 0) {
        const item = category.items[0];
        expect(item).toHaveProperty('description');
        expect(item).toHaveProperty('sum');
        expect(item).toHaveProperty('date');
      }
    }

    // Check summary structure
    expect(response.body.summary).toHaveProperty('categories');
    expect(response.body.summary).toHaveProperty('total');
    expect(Array.isArray(response.body.summary.categories)).toBe(true);
  });

  it('should return an error for missing parameters', async () => {
    const response = await request(app).get('/api/report');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});
