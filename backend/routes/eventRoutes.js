const express = require('express');
const router = express.Router();

const eventController = require('../controllers/eventController');

router.post('/newevent', eventController.addEvent);

router.get('/:stableId', eventController.getEvent);

router.delete('/removeevent/:id', eventController.deleteEvent);

module.exports = router;
