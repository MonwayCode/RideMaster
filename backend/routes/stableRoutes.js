const express = require('express');
const router = express.Router();
const stableController = require('../controllers/stableController');

router.post('/newstable', stableController.addStable);
router.get('/', stableController.getStables);

module.exports = router;
