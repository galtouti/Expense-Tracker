const request = require('supertest');
const { app } = require('./setup');
const Cost = require('../models/cost');

describe('GET /api/report', () => {
  beforeEach(async () => {
    // Clear costs collection before each test
    await Cost.deleteMany({});
  });

  it('should return costs for a specific user, year, and month', async () => {
    // Add test costs
    await Cost.create([
      {
        description: 'Test expense 1',
        category: 'food',
        userid: '123123',
        sum: 100,
        date: new Date('2025-01-15') // January 2025
      },
      {
        description: 'Test expense 2',
        category: 'health',
        userid: '123123',
        sum: 200,
        date: new Date('2025-01-20') // January 2025
      },
      {
        description: 'Different month',
        category: 'food',
        userid: '123123',
        sum: 300,
        date: new Date('2025-02-15') // February 2025 - shouldn't be included
      }
    ]);

    const response = await request(app)
      .get('/api/report?id=123123&year=2025&month=1');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('costs');
    expect(response.body).toHaveProperty('categorySummaries');
    expect(response.body).toHaveProperty('summary');
    
    // Check costs array
    expect(response.body.costs).toHaveLength(2);
    expect(response.body.costs[0].sum).toBe(100);
    expect(response.body.costs[1].sum).toBe(200);
    
    // Check category summaries
    expect(response.body.categorySummaries).toHaveLength(2);
    const foodCategory = response.body.categorySummaries.find(c => c.category === 'food');
    const healthCategory = response.body.categorySummaries.find(c => c.category === 'health');
    expect(foodCategory.sum).toBe(100);
    expect(healthCategory.sum).toBe(200);
    
    // Check total summary
    expect(response.body.summary.total).toBe(300);
    expect(response.body.summary.categories).toContain('food');
    expect(response.body.summary.categories).toContain('health');
  });

  it('should return empty arrays when no costs exist for the period', async () => {
    const response = await request(app)
      .get('/api/report?id=123123&year=2024&month=1');
    
    expect(response.statusCode).toBe(200);
    expect(response.body.costs).toHaveLength(0);
    expect(response.body.categorySummaries).toHaveLength(0);
    expect(response.body.summary.total).toBe(0);
    expect(response.body.summary.categories).toHaveLength(0);
  });

  it('should return an error for missing parameters', async () => {
    const response = await request(app).get('/api/report');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toMatch(/missing required parameters/i);
  });
});
