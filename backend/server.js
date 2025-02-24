const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./models/db.js');
const destinationRoutes = require('./routes/destinations');
const itineraryRoutes = require('./models/ItineraryRoutes.js');
const bookingRoutes = require('./routes/bookings.js');
const cors = require('cors');

// Load env variables first
dotenv.config();

// Create express app
const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://globe-bg.vercel.app',
    'https://globe-frontend-bay.vercel.app',
    'http://localhost:5000',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'This is backend' });
});

app.use('/api/destinations', destinationRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Export for Vercel 