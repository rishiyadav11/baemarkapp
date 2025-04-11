const axios = require('axios');
const Order = require('../models/Order');
const User = require('../models/user');

let shiprocketToken = null;

// Get token from Shiprocket
const getShiprocketToken = async () => {
  if (shiprocketToken) return shiprocketToken;

  const res = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });

  shiprocketToken = res.data.token;
  return shiprocketToken;
};

// ✅ Create Shiprocket Order
exports.createShiprocketOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('products').populate('user');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const user = order.user;
    const token = await getShiprocketToken();

    const response = await axios.post(
      'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      {
        order_id: order._id,
        order_date: new Date().toISOString().split('T')[0],
        pickup_location: "Primary",
        billing_customer_name: user.name,
        billing_last_name: "",
        billing_address: user.address || "Default address",
        billing_city: user.city || "Delhi",
        billing_pincode: user.pincode || "110001",
        billing_state: user.state || "Delhi",
        billing_country: "India",
        billing_email: user.email,
        billing_phone: user.phone || "9999999999",
        shipping_is_billing: true,
        order_items: order.products.map(prod => ({
          name: prod.name,
          sku: prod._id.toString(),
          units: 1,
          selling_price: prod.price,
        })),
        payment_method: "Prepaid",
        shipping_charges: 0,
        sub_total: order.totalAmount,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("✅ Shiprocket Order Created:", response.data);
    res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    console.error("❌ Shiprocket Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Track Shipment by AWB
exports.trackOrder = async (req, res) => {
  try {
    const { awb } = req.params;
    const token = await getShiprocketToken();

    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.status(200).json({ success: true, tracking: response.data });
  } catch (err) {
    console.error("❌ Tracking Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};



// controllers/shipRocketController.js
exports.shiprocketWebhookHandler = async (req, res) => {
  try {
    const { awb, status, current_status, shipment_id } = req.body;

    // Update order in DB based on awb or shipment_id
    await Order.findOneAndUpdate(
      { awb }, 
      {
        shipping_status: current_status,
        shiprocket_status: status,
        updatedAt: new Date()
      }
    );

    console.log(`📦 Status updated: ${awb} → ${current_status}`);
    res.status(200).send('Webhook received');
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    res.status(500).send('Error');
  }
};
