const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('../models/userModel');

const forgotPasswordRequestSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the User model
    ref: 'User',  // This defines the reference to the User model
    required: true,
  }
});

module.exports = mongoose.model('ForgotPasswordRequest', forgotPasswordRequestSchema);
