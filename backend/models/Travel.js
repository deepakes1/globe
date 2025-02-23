const mongoose = require('mongoose');

const travelSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  transport_type: {
    type: String,
    required: true
  },
  from_place: {
    type: String,
    required: true
  },
  to_place: {
    type: String,
    required: true
  },
  travel_date: {
    type: Date,
    required: true
  },
  transport_name: {
    type: String,
    required: true
  },
  departure_time: {
    type: String,
    required: true
  },
  arrival_time: {
    type: String,
    required: true
  },
  number_of_seats: {
    type: Number,
    required: true
  },
  price_per_seat: {
    type: Number,
    required: true
  },
  total_amount: {
    type: Number,
    required: true
  },
  booking_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Travel', travelSchema); 