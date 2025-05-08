const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  isPredefined: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
