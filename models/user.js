const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  first_name: { 
    type: String, 
    required: true 
  },
  last_name: { 
    type: String, 
    required: true 
  },
  birthday: { 
    type: Date, 
    required: true 
  },
  marital_status: { 
    type: String, 
    required: true,
    enum: ['single', 'married', 'divorced', 'widowed']
  }
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);