const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  stockQuantity: { type: Number, default: 0 },
  stockThreshold: { type: Number, default: 0 },
  category: { 
    type: String, 
    enum: [
      "DRYFOOD",
      "COLDFOOD",
      "FROZENFOOD",
      "MEDICINE",
      "PERSONALCARE",
      "CLEANINGSUPPLY",
      "ELECTRONIC",
      "APPAREL",
      "TOYS"
    ]},
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
  expirationDate: { type: Date }

});

module.exports = mongoose.model('Item', ItemSchema);