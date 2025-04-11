require('dotenv').config();
const crypto = require('crypto');

const order_id = 'order_QHi5xH9T2AEGgc';
const payment_id = 'pay_FAKE1234567890';
const secret = process.env.RAZORPAY_KEY_SECRET;

const generated_signature = crypto
  .createHmac('sha256', secret)
  .update(`${order_id}|${payment_id}`)
  .digest('hex');

console.log('Generated Signature:', generated_signature);
