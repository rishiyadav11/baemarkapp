
// utils/shiprocketAuth.js
const axios = require('axios');
let cachedToken = null;
exports.getShiprocketToken = async () => {
  if (cachedToken) return cachedToken;
  const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  });
  cachedToken = response.data.token;
  return cachedToken;
};

