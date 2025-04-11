const mongoose = require('mongoose');

const kitSchema = new mongoose.Schema({
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      price: Number,
    }
  ],
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Kit', kitSchema);