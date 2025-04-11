const mongoose = require("mongoose")
const clothSchema = new mongoose.Schema({
  name: String,
  fabric: String,
  color: String,
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      url: String,
      public_id: String,
    }
  ],

  sizes: [
    {
      label: String,     // e.g., "S", "M", "L"
      quantity: Number,  // stock count
    }
  ],

  category: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    default: 0, // percentage (e.g., 10 for 10%)
  },


  gender: {
    type: String,
    enum: ["men", "women", "unisex"],
    required: true,
  },
});

module.exports = mongoose.model('Cloth', clothSchema);
