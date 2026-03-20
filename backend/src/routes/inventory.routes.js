const express = require('express');
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  applyEndOfDayUpdates
} = require('../controllers/inventory.controller');

const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', protect, createItem);
router.get('/', protect, getItems);
router.get('/:id', protect, getItemById);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

router.post('/apply-eod', protect, applyEndOfDayUpdates);

module.exports = router;