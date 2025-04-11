const mongoose = require("mongoose")

const lipBalmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  flavor: {
    type: String  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0, // percentage (e.g., 10 for 10%)
  },

  images: [
    {
      url: String,
      public_id: String,
    }
  ],  quantity: Number,
});

module.exports = mongoose.model('LipBalm', lipBalmSchema);
