const express = require('express');
const router = express.Router();
const {
  addAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require('../controllers/addressController');

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, addAddress);
router.get('/', verifyToken, getAllAddresses);
router.put('/:id', verifyToken, updateAddress);
router.delete('/:id', verifyToken, deleteAddress);
router.patch('/:id/default', verifyToken, setDefaultAddress);

module.exports = router;
