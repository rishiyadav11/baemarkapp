// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { saveOrder } = require('../controllers/orderController');
router.post('/create', saveOrder);
module.exports = router;