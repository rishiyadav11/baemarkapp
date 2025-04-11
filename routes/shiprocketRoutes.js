const express = require('express');
const router = express.Router();
const { createShiprocketOrder, trackOrder , shiprocketWebhookHandler} = require('../controllers/shipRocketController');
router.post('/create', createShiprocketOrder);
router.get('/track/:awb', trackOrder);
// routes/shiprocketRoutes.js
router.post('/webhook', shiprocketWebhookHandler);

module.exports = router;
