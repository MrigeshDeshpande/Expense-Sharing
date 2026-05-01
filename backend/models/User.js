const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
