const Order = require("../models/Order");
const User = require("../models/user");
const sendMail = require("../utils/sendEmail"); // Optional mail utility

exports.saveOrder = async (req, res) => {
  const {
    userId,
    productIds,
    razorpay_order_id,
    razorpay_payment_id,
    totalAmount
  } = req.body;

  try {
    const order = await Order.create({
      user: userId,
      products: productIds,
      razorpay_order_id,
      razorpay_payment_id,
      totalAmount
    });

    // Mark user as paid (optional)
    await User.findByIdAndUpdate(userId, { isPaid: true });

    // Email confirmation (optional)
    const user = await User.findById(userId);
    await sendMail(user.email, "Order Confirmed", `Your order was placed successfully!`);

    res.status(201).json({ success: true, message: "Order saved", order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order save failed", error: error.message });
  }
};
