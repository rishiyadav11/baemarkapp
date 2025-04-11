const express = require('express');
const {
  addItemToCategory,
  deleteItemFromCategory,
  getItemsByCategory,
  updateItemInCategory
} = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new item to a category
router.post('/:category', verifyToken, isAdmin, addItemToCategory);

// Delete an item from a category
router.delete('/:category/:itemId', verifyToken, isAdmin, deleteItemFromCategory);

//Edit an item from a category 
router.put('/:category/:itemId', updateItemInCategory);


// Get all items in a category
router.get('/:category', getItemsByCategory);

module.exports = router;
