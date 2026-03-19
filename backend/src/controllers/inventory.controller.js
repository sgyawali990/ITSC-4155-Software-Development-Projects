const Item = require('../models/Item');

const validateItemInput = ({ itemName, quantity, reorderThreshold }) => {
  if (!itemName || typeof itemName !== 'string' || itemName.trim() === '') {
    return 'itemName is required and must be a non-empty string';
  }

  if (quantity === undefined || quantity === null || isNaN(quantity) || Number(quantity) < 0) {
    return 'quantity is required and must be a number greater than or equal to 0';
  }

  if (
    reorderThreshold === undefined ||
    reorderThreshold === null ||
    isNaN(reorderThreshold) ||
    Number(reorderThreshold) < 0
  ) {
    return 'reorderThreshold is required and must be a number greater than or equal to 0';
  }

  return null;
};

const createItem = async (req, res) => {
  try {
    const { itemName, quantity, reorderThreshold } = req.body;

    const validationError = validateItemInput({ itemName, quantity, reorderThreshold });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const item = await Item.create({
      itemName: itemName.trim(),
      quantity: Number(quantity),
      reorderThreshold: Number(reorderThreshold),
      user: req.user.id
    });

    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { itemName, quantity, reorderThreshold } = req.body;

    const validationError = validateItemInput({ itemName, quantity, reorderThreshold });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const item = await Item.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.itemName = itemName.trim();
    item.quantity = Number(quantity);
    item.reorderThreshold = Number(reorderThreshold);

    const updatedItem = await item.save();

    return res.status(200).json(updatedItem);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.deleteOne();

    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
};