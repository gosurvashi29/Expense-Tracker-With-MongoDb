const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('../models/userModel');

const downloadedSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to User model
    ref: 'User',  // This defines the relationship
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Downloaded', downloadedSchema);
