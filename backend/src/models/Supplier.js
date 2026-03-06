const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  supplierName: { type: String, required: true },
  phoneNumber: { type: String },
  email: { type: String }
});

module.exports = mongoose.model("Supplier", supplierSchema);