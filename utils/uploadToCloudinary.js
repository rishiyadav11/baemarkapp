const cloudinary = require('cloudinary').v2;

const uploadToCloudinary = async (base64Image) => {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'products', // optional
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    console.error("Cloudinary upload error:", err.message);
    throw new Error("Cloudinary Upload Failed");
  }
};

module.exports = uploadToCloudinary;
