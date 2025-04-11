const mongoose = require("mongoose")

const stencilSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  patternType: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      url: String,
      public_id: String,
    }
  ],  discount: {
    type: Number,
    default: 0, // percentage (e.g., 10 for 10%)
  },

  quantity: Number,
});

module.exports = mongoose.model('Stencil', stencilSchema);
