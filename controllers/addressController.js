const Address = require('../models/Address');

// Add new address
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user._id; 
    const address = await Address.create({ ...req.body, userId });
    res.status(201).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add address', error: error.message });
  }
};

// Get all addresses of the logged-in user
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch addresses', error: error.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "Address not found" });

    res.status(200).json({ success: true, address: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update address', error: error.message });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ success: false, message: "Address not found" });

    res.status(200).json({ success: true, message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete address', error: error.message });
  }
};

// Set address as default
exports.setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    // Remove default from other addresses
    await Address.updateMany({ userId }, { $set: { isDefault: false } });

    // Set the selected address as default
    const updated = await Address.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isDefault: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, message: "Default address set", address: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to set default address', error: error.message });
  }
};
