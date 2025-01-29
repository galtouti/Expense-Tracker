require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');

async function setupDefaultUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'expense-tracker'
    });

    // Clear existing users
    await User.deleteMany({});

    // Create default user
    const defaultUser = new User({
      id: '123123',
      first_name: 'moshe',
      last_name: 'israeli',
      birthday: new Date('1990-01-01'), // Default birthday
      marital_status: 'single' // Default status
    });

    await defaultUser.save();
    console.log('Default user created successfully');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error setting up default user:', error);
    process.exit(1);
  }
}

setupDefaultUser(); 