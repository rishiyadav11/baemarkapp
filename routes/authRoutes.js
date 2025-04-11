const express = require("express");
const { 
    signupAuthController, 
    verifyOtpController, 
    sendOtpController,
    loginController 
} = require("../controllers/authController");
const {verifyToken,isAdmin} = require("../middleware/authMiddleware")
const {
    updateUserRole
  } = require('../controllers/adminController');

const router = express.Router();

// Auth routes
router.post("/signup", (signupAuthController));
router.post("/verify-otp", (verifyOtpController));
router.post("/send-otp", (sendOtpController));
router.post("/login", (loginController));



// Admin route to update user role
router.put('/user/role', verifyToken, isAdmin, updateUserRole);



module.exports = router;
