const mongoose = require('mongoose');


const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true },
  priceRange: [{ type: Number, required: true }],
  categories: [{ type: String }],
  type: { type: String, enum: ['national', 'international'], required: true },
  recommendedPlaces: [{
    days: { type: String, required: true },
    places: [{
      name: { type: String, required: true },
      image: { type: String, required: true },
      description: { type: String, required: true }
    }]
  }]
});

module.exports = mongoose.model('Destination', destinationSchema);