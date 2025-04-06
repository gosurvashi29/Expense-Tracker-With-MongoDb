const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');  // Import bcryptjs
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

// // Password hashing middleware before saving the user
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();  // Check if password was modified

//   try {
//     const salt = await bcrypt.genSalt(10);  // Generate salt with a cost of 10 rounds
//     this.password = await bcrypt.hash(this.password, salt);  // Hash the password
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Compare input password with hashed password stored in the database
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);  // Compare the password
// };

module.exports = mongoose.model('User', userSchema);
