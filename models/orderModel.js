const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('../models/userModel');

const orderSchema = new Schema({
  orderId: {
    type: String,  // Mongoose uses String instead of DataTypes.STRING
    required: true,  // `allowNull` in Sequelize is equivalent to `required` in Mongoose
    unique: true,  // Ensure that the orderId is unique
  },
  orderAmount: {
    type: Number,  // Mongoose uses `Number` for both integers and floats
    required: true,  // Ensuring the orderAmount is required
  },
  customerId: {
    type: Number,  // Mongoose uses `Number` for integers
    required: true,  // Ensuring customerId is required
  },
  status: {
    type: String,  // Mongoose uses `String` for text fields
    enum: ['PENDING', 'SUCCESSFUL', 'FAILED'],  // Enum values for status
    default: 'PENDING',  // Default status is PENDING
  },
  paymentSessionId: {
    type: String,  // Mongoose uses `String` for text fields
    required: false,  // This field can be null or not present
  },
  userId: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to User model
      ref: 'User',
      required: true,
    },
}, { timestamps: true });  // Add timestamps to automatically include createdAt and updatedAt fields

module.exports = mongoose.model('Order', orderSchema);
