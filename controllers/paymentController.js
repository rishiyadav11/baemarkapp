const crypto = require('crypto');
const Order = require("../models/Order");
const User = require("../models/user");
const sendMail = require("../utils/sendEmail");

exports.handleWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(req.rawBody)
    .digest('hex');

  if (expectedSignature === signature) {
    const event = JSON.parse(req.rawBody);

    if (event.event === 'order.paid') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const email = payment.email;
      const amount = payment.amount / 100;

      // Optional: Find user by email if needed
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });

      // Save to DB
      await Order.create({
        user: user._id,
        products: [], // You can map products later using orderId if needed
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        payment_status: "success",
        shipping_status: "pending",
        totalAmount: amount,
      });

      await User.findByIdAndUpdate(user._id, { isPaid: true });

      await sendMail({
        to: email,
        subject: "Your order is confirmed 💖",
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #333;">
            <h2 style="color: #d63384;">Hey ${user.name.split(" ")[0]},</h2>
            <p>Yay! We've received your payment of ₹${amount} 🥰</p>
            <p>Your order is being processed and we’ll keep you posted when it's on the way!</p>
            <p style="color: #d63384;">Thanks a bunch! <br> 💝 The Dreamy Team</p>
          </div>
        `,
      });

      console.log('💰 Verified & saved payment for:', email);
      return res.status(200).json({ success: true });
    }

    return res.status(200).json({ success: true, message: "Unhandled event" });
  } else {
    console.log('❌ Invalid webhook signature!');
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      productIds,
      amount
    } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      const order = await Order.create({
        user: userId,
        products: productIds,
        razorpay_order_id,
        razorpay_payment_id,
        payment_status: "success",
        shipping_status: "pending",
        totalAmount: amount,
      });

      await User.findByIdAndUpdate(userId, { isPaid: true });
      const user = await User.findById(userId);

      await sendMail({
        to: user.email,
        subject: "Your order is confirmed 💖",
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; color: #333;">
            <h2 style="color: #d63384;">Hey ${user.name.split(" ")[0]},</h2>
            <p>Thank you so much for your purchase! 💕</p>
            <p>Your payment was successful and we’re getting your order ready to be shipped!</p>
            <ul>
              <li><strong>Order ID:</strong> ${razorpay_order_id}</li>
              <li><strong>Payment ID:</strong> ${razorpay_payment_id}</li>
              <li><strong>Amount Paid:</strong> ₹${amount}</li>
            </ul>
            <p style="margin-top: 20px;">We’ll notify you once your goodies are on the way! 🚚✨</p>
            <p style="color: #d63384;">With love, <br> The Dreamy Team 💗</p>
          </div>
        `,
      });

      res.status(200).json({ success: true, message: "Payment verified, order saved & email sent!" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
