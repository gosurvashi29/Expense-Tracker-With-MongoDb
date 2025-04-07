const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('../models/userModel');

const userSchema = new Schema({
  username: {
    type: String,  
    required: true,
    unique: true,
  },
  email: {
    type: String,  
    required: true,
    unique: true,
  },
  password: {
    type: String,  
    required: true,
  },
  isPremium: {
    type: Boolean,  
    default: false,
  },
  totalAmount: {
    type: Number,  
    default: 0,
  }
}, { timestamps: true }); 


module.exports = mongoose.model('User', userSchema);
