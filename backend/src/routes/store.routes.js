const router = require("express").Router();
const Store = require("../models/Store");
const { protect } = require("../middleware/auth.middleware");

// Get Store Info
router.get("/", protect, async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch store" });
  }
});

// Update Store Mode
router.patch("/update-mode", protect, async (req, res) => {
  try {
    const { updateMode } = req.body;
    
    if (!["MANUAL", "EOD"].includes(updateMode)) {
      return res.status(400).json({ message: "Invalid mode" });
    }

    const store = await Store.findOneAndUpdate(
      { owner: req.user.id },
      { updateMode },
      { new: true }
    );

    res.json(store);
  } catch (err) {
    res.status(500).json({ error: "Failed to update store mode" });
  }
});

module.exports = router;