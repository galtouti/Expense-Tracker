/**
 * @module tests/about
 * @description Test suite for team information endpoint
 */

const request = require('supertest');
const { app } = require('./setup');
const mongoose = require('mongoose');
const About = mongoose.model('About');

/**
 * Test suite for about endpoint
 * @group GET /api/about
 */
describe('GET /api/about', () => {
  /**
   * Setup test data before each test
   * @function beforeEach
   */
  beforeEach(async () => {
    /* Clean up existing team data */
    await About.deleteMany({});
    
    /* Insert test team members */
    await About.create([
      {
        id: "123456789",
        first_name: "Gal",
        last_name: "Touti",
        birthday: new Date("1990-01-01"),
        marital_status: "single"
      },
      {
        id: "987654321",
        first_name: "Sahar",
        last_name: "Abitbol",
        birthday: new Date("1990-01-01"),
        marital_status: "single"
      }
    ]);
  });

  /* Test retrieval of team member information */
  it('should return the team details', async () => {
    const res = await request(app).get('/api/about');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    /* Verify first team member details */
    expect(res.body).toContainEqual({ first_name: 'Gal', last_name: 'Touti' });
    /* Verify second team member details */
    expect(res.body).toContainEqual({ first_name: 'Sahar', last_name: 'Abitbol' });
  });
});
