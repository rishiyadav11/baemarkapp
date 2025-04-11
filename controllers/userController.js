const User = require('../models/user');
const Address = require('../models/Address');
const Order = require('../models/Order');
const cloudinary = require('../config/cloudinary');


exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const addresses = await Address.find({ userId });
    const orders = await Order.find({ userId });

    res.status(200).json({
      success: true,
      user,
      addresses,
      orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let newImage = user.image; // default to existing

    if (req.body.image) {
      // 🧹 Delete old image only if it's not default
      if (user.image.public_id) {
        await cloudinary.uploader.destroy(user.image.public_id);
      }

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(req.body.image, {
        folder: 'user_profiles',
      });

      newImage = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    const updates = {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      image: newImage,
    };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile', error: error.message });
  }
};
