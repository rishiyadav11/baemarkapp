const Clothes = require('../models/Cloth');
const Stencils = require('../models/Stencil');
const Colors = require('../models/Color');
const Lipbalm = require('../models/LipBalm');
const GiftBox = require('../models/GiftBox');
const Kit = require('../models/Kit');

exports.createKit = async (req, res) => {
  try {
    const { clothId, colorId, stencilId, lipBalmId, giftBoxId } = req.body;
    const userId = req.user?._id || null; // If user auth is set up

    const [cloth, color, stencil, lipBalm, giftBox] = await Promise.all([
      Clothes.findById(clothId),
      Colors.findById(colorId),
      Stencils.findById(stencilId),
      Lipbalm.findById(lipBalmId),
      GiftBox.findById(giftBoxId),
    ]);

    if (!cloth || !color || !stencil || !lipBalm || !giftBox) {
      return res.status(400).json({ success: false, message: 'Invalid product selection' });
    }

    const total = cloth.price + color.price + stencil.price + lipBalm.price + giftBox.price;

    const kitData = {
      userId,
      products: [
        { type: 'Cloth', productId: cloth._id, name: cloth.name, price: cloth.price },
        { type: 'Color', productId: color._id, name: color.name, price: color.price },
        { type: 'Stencil', productId: stencil._id, name: stencil.name, price: stencil.price },
        { type: 'LipBalm', productId: lipBalm._id, name: lipBalm.name, price: lipBalm.price },
        { type: 'GiftBox', productId: giftBox._id, name: giftBox.name, price: giftBox.price },
      ],
      totalPrice: total
    };

    const newKit = new Kit(kitData);
    const savedKit = await newKit.save();

    res.status(201).json({ success: true, kit: savedKit });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Kit creation failed', error: error.message });
  }
};




// controllers/kitController.js
exports.getAllKits = async (req, res) => {
    try {
      const kits = await Kit.find(); // Removed `.populate()`
      res.status(200).json({ success: true, kits });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch kits', error: error.message });
    }
  };
  