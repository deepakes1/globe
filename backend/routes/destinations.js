const express = require('express');
const Destination = require('../models/Destination.js');
const mongoose = require('mongoose');
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
  try {
    const destination = new Destination(req.body);
    const newDestination = await destination.save();
    res.status(201).json(newDestination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete destination
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid destination ID format' });
    }

    const destination = await Destination.findByIdAndDelete(id);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    return res.status(200).json({ 
      message: 'Destination deleted successfully',
      deletedId: id
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router; 