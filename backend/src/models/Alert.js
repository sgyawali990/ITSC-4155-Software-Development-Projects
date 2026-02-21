const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  message: { type: String },
  triggeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);