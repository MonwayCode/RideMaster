const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');

// Pobieranie wszystkich treningów
router.get('/:stableId', trainingController.getTrainings);

// Dodawanie treningu
router.post('/newtraining', trainingController.newTraining);

// Aktualizowanie treningu
router.put('/updatetraining/:lessonId', trainingController.updateTraining);
router.put('/canceltraining/:lessonId', trainingController.cancelTraining);

// Usuwanie treningu
router.delete('/removetraining/:lessonId', trainingController.removeTraining);


module.exports = router;
