// controllers/adminController.js
exports.updateUserRole = async (req, res) => {
    const { email, role } = req.body;
  
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
  
    const user = await User.findOneAndUpdate(
      { email },
      { role },
      { new: true }
    );
  
    if (!user) return res.status(404).json({ message: "User not found" });
  
    return res.status(200).json({ message: "Role updated", user });
  };