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

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('This is backend');
});

app.use('/api/destinations', destinationRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 