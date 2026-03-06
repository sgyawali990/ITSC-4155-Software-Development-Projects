const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    storeName: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Store", storeSchema);