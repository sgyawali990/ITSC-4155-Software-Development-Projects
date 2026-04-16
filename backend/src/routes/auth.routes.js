const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword
} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put('/change-password', protect, changePassword);

module.exports = router;