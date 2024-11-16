const express = require('express');
const router = express.Router();
const horseController = require('../controllers/horseController');

// Dodanie nowego konia
router.post('/addHorse', horseController.addHorse);

// Usunięcie konia
router.delete('/removeHorse/:horseId', horseController.removeHorse);

// Pobranie listy koni w stajni
router.get('/:stableId', horseController.getHorse);

module.exports = router;
