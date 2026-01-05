const mongoose = require('mongoose');

/**
 * User Schema
 * Represents a user in the Cost Manager system
 */
const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    description: 'Custom unique ID for the user'
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  birthday: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone_number: {
    type: String,
    match: [/^\d{3}-\d{7}$/, 'Phone number must be in format XXX-XXXXXXX']
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
