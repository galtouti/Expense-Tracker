// about.test.js
const request = require('supertest');
const { app } = require('./setup');
const mongoose = require('mongoose');
const About = mongoose.model('About');

describe('GET /api/about', () => {
  beforeEach(async () => {
    // Clear existing data
    await About.deleteMany({});
    
    // Insert test data
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
