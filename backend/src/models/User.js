const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type : String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["OWNER", "ADMIN", "CUSTOMER"], default: "OWNER" }
});

module.exports = mongoose.model('User', UserSchema);