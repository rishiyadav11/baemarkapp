const Clothes = require('../models/Cloth');
const Stencils = require('../models/Stencil');
const Colors = require('../models/Color');
const Lipbalm = require('../models/LipBalm');
const GiftBox = require('../models/GiftBox');
const uploadToCloudinary = require('../utils/uploadToCloudinary');
const cloudinary = require('cloudinary').v2;

const modelMap = {
  clothes: Clothes,
  stencils: Stencils,
  colors: Colors,
  lipbalm: Lipbalm,
  giftbox: GiftBox,
};

// ✅ Add item
exports.addItemToCategory = async (req, res) => {
  const category = req.params.category.toLowerCase();
  const Model = modelMap[category];

  if (!Model) return res.status(400).json({ message: 'Invalid category' });

  try {
    const { image, ...data } = req.body;

    if (!image || !Array.isArray(image)) {
      return res.status(400).json({ message: 'Images must be provided as an array' });
    }

    const uploadedImages = await Promise.all(
      image.map((img) => uploadToCloudinary(img)) // should return { url, public_id }
    );

    const item = new Model({
      ...data,
      images: uploadedImages,
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete item
exports.deleteItemFromCategory = async (req, res) => {
  const category = req.params.category.toLowerCase();
  const Model = modelMap[category];

  if (!Model) return res.status(400).json({ message: 'Invalid category' });

  try {
    const item = await Model.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete associated images from Cloudinary
    if (item?.images?.length) {
      for (const img of item.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await item.deleteOne();

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all items in a category
exports.getItemsByCategory = async (req, res) => {
  const category = req.params.category.toLowerCase();
  const Model = modelMap[category];

  if (!Model) return res.status(400).json({ message: 'Invalid category' });

  try {
    const items = await Model.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update item
exports.updateItemInCategory = async (req, res) => {
  const category = req.params.category.toLowerCase();
  const itemId = req.params.itemId;
  const Model = modelMap[category];

  if (!Model) return res.status(400).json({ message: 'Invalid category' });

  try {
    const { image, ...data } = req.body;
    let updatedData = { ...data };

    if (Array.isArray(image) && image.length > 0) {
      const oldItem = await Model.findById(itemId);
      if (oldItem?.images?.length) {
        for (const img of oldItem.images) {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        }
      }

      const uploadedImages = await Promise.all(
        image.map((img) => uploadToCloudinary(img))
      );

      updatedData.images = uploadedImages;
    }

    const updatedItem = await Model.findByIdAndUpdate(itemId, updatedData, {
      new: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
