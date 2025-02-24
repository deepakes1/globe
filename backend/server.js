const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./models/db.js');
const destinationRoutes = require('./routes/destinations');
const itineraryRoutes = require('./models/ItineraryRoutes.js');
const bookingRoutes = require('./routes/bookings.js');
const cors = require('cors');

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get('/api', (req, res) => {
  res.send('This is backend');
});

app.use('/api/destinations', destinationRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/bookings', bookingRoutes);

// For Vercel, export the express app
module.exports = app;

// Only listen to port if running directly (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
