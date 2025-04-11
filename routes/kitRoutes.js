const express = require('express');
const router = express.Router();
const { createKit ,getAllKits } = require('../controllers/kitController');
const { verifyToken,isAdmin } = require('../middleware/authMiddleware');

router.post('/create', createKit);
router.get('/all', verifyToken, isAdmin, getAllKits); // 👈 Admin-only route

module.exports = router;
