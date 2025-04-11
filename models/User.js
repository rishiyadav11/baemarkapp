const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: Number,
      default: 0,
    },
    image: {
      url: {
        type: String,
        default: 'https://img.freepik.com/free-vector/fashion-young-koreans_23-2148630019.jpg?ga=GA1.1.1092467876.1743869642&semt=ais_hybrid&w=740',
      },
      public_id: {
        type: String,
        default: '', // empty if using default image
      }
    },    
    isVerified: {
      type: Boolean,
      default: false,
    },
    savedAddresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
