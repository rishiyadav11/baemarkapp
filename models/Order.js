const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  razorpay_order_id: String,
  razorpay_payment_id: String,
  payment_status: { type: String, default: "success" },
  shipping_status: { type: String, default: "pending" },
  totalAmount: Number,
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
