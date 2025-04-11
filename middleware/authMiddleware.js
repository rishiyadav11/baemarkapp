const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT token
exports.verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }
};

// Check if user is admin
exports.isAdmin = async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Forbidden: Admin access only" });
    }

    next();
};
