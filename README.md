# Personal Expense Tracker

A simple and intuitive web service that allows users to track their expenses by adding costs, viewing monthly reports, and managing their user details.

## Features
- **Add Costs**: Easily log your daily expenses.
- **Monthly Reports**: View a breakdown of your expenses by category and time period.
- **User Management**: Retrieve and manage user details.

## Project Structure
```plaintext
expense-tracker/
├── models/
│   ├── cost.js         # Schema for costs
│   └── user.js         # Schema for user details
├── routes/
│   ├── about.js        # About route
│   ├── costs.js        # Routes for cost operations
│   ├── report.js       # Routes for generating reports
│   └── users.js        # Routes for user operations
├── tests/
│   ├── costs.test.js   # Tests for cost functionalities
│   ├── report.test.js  # Tests for report functionalities
│   └── users.test.js   # Tests for user functionalities
├── .env                # Environment variables
├── app.js              # Main application entry point
├── package.json        # Project dependencies
├── package-lock.json   # Dependency tree lockfile
└── README.md           # Project documentation
```

## Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: React (optional, for building a web UI)
- **Database**: MongoDB
- **Testing**: Jest, Supertest

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following:
   ```plaintext
   MONGO_URI=<your-mongodb-connection-string>
   PORT=3000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Run tests:
   ```bash
   npm test
   ```

## API Endpoints
### Users
- **GET /users**: Retrieve all users
- **POST /users**: Create a new user

### Costs
- **GET /costs**: Retrieve all costs
- **POST /costs**: Add a new cost

### Reports
- **GET /report?month=MM&year=YYYY**: Retrieve monthly expense reports

### About
- **GET /about**: Retrieve application details

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any features or improvements.

## License
This project is licensed under the [MIT License](LICENSE).

---

Happy tracking! 🎉
