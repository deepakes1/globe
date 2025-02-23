const express = require('express');
const Destination = require('../models/Destination.js');

const router = express.Router();

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find({});
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get destinations by type (national/international)
router.get('/type/:type', async (req, res) => {
  try {
    const destinations = await Destination.find({ type: req.params.type });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new destination
router.post('/', async (req, res) => {
  const destination = new Destination(req.body);
  try {
    const newDestination = await destination.save();
    res.status(201).json(newDestination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;