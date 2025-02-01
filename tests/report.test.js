/**
 * @module tests/report
 * @description Test suite for expense report generation endpoints
 */

const request = require('supertest');
const { app } = require('./setup');

/**
 * Test suite for report generation functionality
 * @group Report API
 */
describe('Report API', () => {
  /* Test user ID for report generation */
  const testUserId = '77777';

  /**
   * Setup test data before all tests
   * Creates a test user and adds sample expenses
   * @function beforeAll
   */
  beforeAll(async () => {
    /* Create test user */
    await request(app)
      .post('/api/users')
      .send({
        id: testUserId,
        first_name: 'Report',
        last_name: 'User',
        birthday: '1995-05-05',
        marital_status: 'single'
      });

    /* Add housing expense */
    await request(app)
      .post('/api/add')
      .send({
        description: 'Rent',
        category: 'housing',
        userid: testUserId,
        sum: 1000,
        date: '2024-01-10'
      });

    /* Add sport expense */
    await request(app)
      .post('/api/add')
      .send({
        description: 'Gym',
        category: 'sport',
        userid: testUserId,
        sum: 150,
        date: '2024-01-15'
      });
  });

  /* Test complete monthly report generation */
  it('should return a monthly report with all categories and correct totals', async () => {
    const response = await request(app)
      .get('/api/report')
      .query({ id: testUserId, year: '2024', month: '1' });

    /* Verify basic report properties */
    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(testUserId);
    expect(response.body.month).toBe(1);
    expect(response.body.year).toBe(2024);

    /* Verify all expense categories are present */
    const categories = ['food', 'health', 'housing', 'sport', 'education'];
    categories.forEach(category => {
      const categoryData = response.body.categories.find(cat => cat.category === category);
      expect(categoryData).toBeDefined();
    });

    /* Verify categories with expenses */
    const housingCategory = response.body.categories.find(cat => cat.category === 'housing');
    const sportCategory = response.body.categories.find(cat => cat.category === 'sport');
    expect(housingCategory.categoryTotal).toBe(1000);
    expect(housingCategory.expensesCount).toBe(1);
    expect(sportCategory.categoryTotal).toBe(150);
    expect(sportCategory.expensesCount).toBe(1);

    /* Verify categories without expenses */
    const foodCategory = response.body.categories.find(cat => cat.category === 'food');
    const healthCategory = response.body.categories.find(cat => cat.category === 'health');
    const educationCategory = response.body.categories.find(cat => cat.category === 'education');
    
    expect(foodCategory.categoryTotal).toBe(0);
    expect(foodCategory.expensesCount).toBe(0);
    expect(foodCategory.expenses).toHaveLength(0);
    
    expect(healthCategory.categoryTotal).toBe(0);
    expect(healthCategory.expensesCount).toBe(0);
    expect(healthCategory.expenses).toHaveLength(0);
    
    expect(educationCategory.categoryTotal).toBe(0);
    expect(educationCategory.expensesCount).toBe(0);
    expect(educationCategory.expenses).toHaveLength(0);

    /* Verify report summary */
    expect(response.body.summary.totalAmount).toBe(1150); // 1000 + 150
    expect(response.body.summary.totalCategories).toBe(2); // housing and sport
    expect(response.body.summary.totalExpenses).toBe(2); // two expenses
  });

  /* Test report for period with no expenses */
  it('should return all categories with zeros when no expenses exist', async () => {
    const response = await request(app)
      .get('/api/report')
      .query({ id: testUserId, year: '2022', month: '12' });

    expect(response.statusCode).toBe(200);
    expect(response.body.categories).toHaveLength(5);
    
    /* Verify all categories are empty */
    response.body.categories.forEach(category => {
      expect(category.categoryTotal).toBe(0);
      expect(category.expensesCount).toBe(0);
      expect(category.expenses).toHaveLength(0);
    });

    /* Verify empty summary */
    expect(response.body.summary.totalAmount).toBe(0);
    expect(response.body.summary.totalCategories).toBe(0);
    expect(response.body.summary.totalExpenses).toBe(0);
  });

  /* Test parameter validation */
  it('should fail if missing parameters', async () => {
    /* Test missing year parameter */
    let response = await request(app)
      .get('/api/report')
      .query({ id: testUserId, month: '1' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Missing year/);

    /* Test missing month parameter */
    response = await request(app)
      .get('/api/report')
      .query({ id: testUserId, year: '2024' });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toMatch(/Missing month/);
  });
});
