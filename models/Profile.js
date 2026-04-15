const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  gender: String,
  gender_probability: Number,
  sample_size: Number,
  age: Number,
  age_group: String,
  country_id: String,
  country_probability: Number,
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profile', profileSchema);