const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/clients', customerController.addCustomer);

router.get('/list/:userId', customerController.listOfStables);
router.get('/participants/:stableId', customerController.listOfParticipants);

router.put('/role/:userId', customerController.roleUpdate);

router.delete('/removeuser/:userId', customerController.deleteCustomer);
router.delete('/removestable/:stableId', customerController.deleteStable);

module.exports = router;