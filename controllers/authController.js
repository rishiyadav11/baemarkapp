const User = require("../models/user");
const sendEmailFn = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const { userSignupValidator } = require("../validators/user.validator");


const JWT_SECRET = process.env.JWT_SECRET;

exports.signupAuthController = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Request body is required" });
        }

        const validationResult = userSignupValidator.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: validationResult.error.errors
            });
        }

        const { name, email, phone } = validationResult.data;

        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
            return res.status(400).json({ success: false, message: "Phone number already exists" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("OTP for development:", otp);

        const user = await User.create({ name, email, phone, otp });

        try {
            await sendEmailFn({
                email,
                subject: "Your Verification Code",
                msg: `<p>Your OTP is: <strong>${otp}</strong></p>`
            });

            return res.status(201).json({
                success: true,
                message: "User signed up successfully. OTP sent to email.",
                user: { name, email, phone }
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            return res.status(201).json({
                success: true,
                message: "User signed up but failed to send OTP email. Please try resending OTP.",
                user: { name, email, phone },
                otp
            });
        }
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message || "Unknown error"
        });
    }
};

exports.loginController = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Request body is required" });
        }

        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log("Login OTP for development:", otp);

        user.otp = Number(otp);
        await user.save();

        try {
            await sendEmailFn({
                email,
                subject: "Your Login Verification Code",
                msg: `<p>Your login OTP is: <strong>${otp}</strong></p>`
            });

            return res.status(200).json({
                success: true,
                message: "OTP sent to email.",
                user: { name: user.name, email: user.email }
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            return res.status(200).json({
                success: true,
                message: "Failed to send OTP email. Please try again.",
                user: { name: user.name, email: user.email },
                otp
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message || "Unknown error"
        });
    }
};

exports.verifyOtpController = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Request body is required" });
        }

        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.otp !== Number(otp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        user.isVerified = true;
        user.otp = 0;
        await user.save();

        const token = jwt.sign(
            {
                _id: user._id.toString(),
                email: user.email,
                role: user.role || 'user'
            },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully. Login successful.",
            token,
            user: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role || 'user'
            }
        });
    } catch (error) {
        console.error("OTP Verification Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message || "Unknown error"
        });
    }
};

exports.sendOtpController = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ success: false, message: "Request body is required" });
        }

        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        user.otp = Number(newOtp);
        await user.save();

        await sendEmailFn({
            email,
            subject: "Your Verification Code",
            msg: `<p>Your OTP is: <strong>${newOtp}</strong></p>`
        });

        return res.status(200).json({ success: true, message: "OTP sent to email." });
    } catch (error) {
        console.error("Resend OTP Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message || "Unknown error"
        });
    }
};
