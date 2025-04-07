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
    required: true,  
  },
  status: {
    type: String,  // Mongoose uses `String` for text fields
    enum: ['PENDING', 'SUCCESSFUL', 'FAILED'],  // Enum values for status
    default: 'PENDING',  
  },
  paymentSessionId: {
    type: String,  
    required: false,  
  },
  userId: {
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'User',
      required: true,
    },
}, { timestamps: true });  

module.exports = mongoose.model('Order', orderSchema);
