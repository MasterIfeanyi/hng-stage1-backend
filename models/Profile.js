const mongoose = require('mongoose');
const { uuidv7 } = require('uuidv7');

const profileSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv7()
  },
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