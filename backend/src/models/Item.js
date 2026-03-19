const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true
    },
    stockQuantity: {
      type: Number,
      default: 0
    },
    stockThreshold: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      enum: [
        'DRYFOOD',
        'COLDFOOD',
        'FROZENFOOD',
        'MEDICINE',
        'PERSONALCARE',
        'CLEANINGSUPPLY',
        'ELECTRONIC',
        'APPAREL',
        'TOYS'
      ]
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store'
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier'
    },
    expirationDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Item', itemSchema);