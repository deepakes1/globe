const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  hotel_name: {
    type: String,
    required: true
  },
  hotel_category: {
    type: String,
    required: true
  },
  check_in: {
    type: Date,
    required: true
  },
  check_out: {
    type: Date,
    required: true
  },
  number_of_rooms: {
    type: Number,
    required: true
  },
  price_per_night: {
    type: Number,
    required: true
  },
  total_amount: {
    type: Number,
    required: true
  },
  amenities: [{
    type: String
  }],
  booking_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hotel', hotelSchema); 