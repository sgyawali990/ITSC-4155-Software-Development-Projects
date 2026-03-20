const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    storeName: { 
        type: String, 
        required: true,
        trim: true 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    
    businessType: {
        type: String,
        enum: ["OFFICE", "WORKSHOP", "SMALL_RETAIL"],
        default: "OFFICE"
    },

    updateMode: {
        type: String,
        enum: ["MANUAL", "EOD"],
        default: "MANUAL"
    }
}, { timestamps: true });

module.exports = mongoose.model("Store", storeSchema);