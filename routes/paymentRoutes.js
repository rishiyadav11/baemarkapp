const express = require("express");
const router = express.Router();
const {
  handleWebhook,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/create-order", handleWebhook);      // frontend se call hota hai
router.post("/verify", verifyPayment);          // frontend se after success payment

module.exports = router;
