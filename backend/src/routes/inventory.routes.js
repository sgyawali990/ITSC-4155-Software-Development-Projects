const express = require("express");
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/inventory.controller");

const { protect } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/", protect, createItem);
router.get("/", protect, getItems);
router.get("/:id", protect, getItemById);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;