const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['OWNER', 'ADMIN', 'CUSTOMER'],
      default: 'OWNER'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);