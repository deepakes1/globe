const express = require('express');
const router = express.Router();
const Travel = require('../models/Travel');
const Hotel = require('../models/Hotel');
const Itinerary = require('../models/Itinerary');

// Travel booking endpoint
router.post('/travel/book', async (req, res) => {
  try {
    const travel = new Travel(req.body);
    await travel.save();
    res.status(201).json({ message: 'Travel booking saved successfully' });
  } catch (error) {
    console.error('Error saving travel booking:', error);
    res.status(500).json({ error: 'Error saving travel booking' });
  }
});

// Hotel booking endpoint
router.post('/hotels/book', async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json({ message: 'Hotel booking saved successfully' });
  } catch (error) {
    console.error('Error saving hotel booking:', error);
    res.status(500).json({ error: 'Error saving hotel booking' });
  }
});

// Get all bookings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const userEmail = req.params.userId;
    console.log('Fetching bookings for user:', userEmail);

    const [travelBookings, hotelBookings, itineraryBookings] = await Promise.all([
      Travel.find({ user_id: userEmail }).sort({ booking_date: -1 }),
      Hotel.find({ user_id: userEmail }).sort({ booking_date: -1 }),
      Itinerary.find({ user_id: userEmail }).sort({ booking_date: -1 })
    ]);

    console.log('Bookings found:', {
      travel: travelBookings.length,
      hotels: hotelBookings.length,
      itineraries: itineraryBookings.length
    });

    res.json({
      travel: travelBookings,
      hotels: hotelBookings,
      itineraries: itineraryBookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
});

// Delete a booking
router.delete('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    let result;

    switch (type) {
      case 'travel':
        result = await Travel.findByIdAndDelete(id);
        break;
      case 'hotel':
        result = await Hotel.findByIdAndDelete(id);
        break;
      case 'itinerary':
        result = await Itinerary.findByIdAndDelete(id);
        break;
      default:
        return res.status(400).json({ error: 'Invalid booking type' });
    }

    if (!result) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting booking' });
  }
});

module.exports = router; 