const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  details: { type: String },
  time: { type: String }
});

const daySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  activities: [activitySchema]
});

const itinerarySchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  itinerary_id: { type: String, required: true },
  destination: { type: String, required: true },
  booking_date: {
    type: Date,
    default: Date.now
  },
  days: [daySchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Itinerary', itinerarySchema); 