# Expense Tracker API

A robust RESTful API service for personal expense tracking, built with Node.js, Express, and MongoDB. This service provides comprehensive functionality for managing users, tracking expenses, and generating detailed financial reports.

## 🚀 Features

- **User Management**
  - Create and manage user profiles
  - Validate user information (ID, name, birthday, marital status)
  - Retrieve user details with total expenses

- **Expense Tracking**
  - Add and categorize expenses
  - Support for multiple expense categories (food, health, housing, sport, education)
  - Validate expense data (amount, description, date)

- **Financial Reporting**
  - Generate detailed monthly expense reports
  - Group expenses by category
  - Calculate totals and statistics
  - Filter reports by user and time period

## 🛠️ Technology Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Testing**: Jest with Supertest
- **Documentation**: JSDoc
- **Code Quality**: ESLint (optional)

## 📁 Project Structure

```plaintext
expense-tracker/
├── models/              # Database schemas and models
│   ├── cost.js         # Expense schema definition
│   └── user.js         # User schema definition
├── routes/             # API route handlers
│   ├── about.js        # Team information endpoints
│   ├── costs.js        # Expense management endpoints
│   ├── report.js       # Report generation endpoints
│   └── users.js        # User management endpoints
├── tests/              # Test suites
│   ├── setup.js        # Test environment configuration
│   ├── costs.test.js   # Expense endpoints tests
│   ├── report.test.js  # Report endpoints tests
│   └── users.test.js   # User endpoints tests
├── app.js              # Application entry point
└── package.json        # Project configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file with:
   ```env
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   PORT=3000
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Users API
- **POST /api/users**
  - Create a new user
  - Required fields: id, first_name, last_name, birthday, marital_status
  - ID must be at least 5 digits

- **GET /api/users/:id**
  - Retrieve user details and total expenses
  - Returns 404 if user not found

### Expenses API
- **POST /api/add**
  - Add a new expense
  - Required fields: description, category, userid, sum
  - Optional: date (defaults to current date)

- **GET /api**
  - Retrieve all expenses
  - Returns array of expense objects

### Reports API
- **GET /api/report**
  - Generate monthly expense report
  - Query parameters: id (user), year, month
  - Returns categorized expenses with totals

### About API
- **GET /api/about**
  - Retrieve team member information
  - Returns developers' details

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📝 API Documentation

Detailed API documentation with request/response examples is available in the [API_DOCS.md](API_DOCS.md) file.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Gal Touti
- Sahar Abitbol

---

Made with ❤️ by the Expense Tracker Team
