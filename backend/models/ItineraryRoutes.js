const express = require('express');
const Itinerary = require('./Itinerary');
const router = express.Router();

// Create new itinerary booking
router.post('/', async (req, res) => {
  try {
    const itinerary = new Itinerary(req.body);
    const savedItinerary = await itinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    console.error('Error saving itinerary:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get itineraries by user_id
router.get('/user/:userId', async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user_id: req.params.userId });
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 