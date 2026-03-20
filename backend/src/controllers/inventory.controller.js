const Item = require('../models/Item');
const Alert = require('../models/Alert');
const User = require('../models/User');
const Store = require('../models/Store');
const { sendLowStockAlert, sendOutOfStockAlert } = require('../utils/email');

const getAdminEmails = async () => {
  const admins = await User.find({ role: { $in: ['ADMIN', 'OWNER'] } }).select('email');
  return admins.map(u => u.email).join(", ");
};

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

const checkAndNotify = async (item) => {
  try {
    const adminEmails = await getAdminEmails();

    const existingAlert = await Alert.findOne({
      itemId: item._id,
      message: { $regex: item.itemName }
    });

    if (item.quantity === 0) {
      if (!existingAlert) {
        // Wrap ONLY the email part so it doesn't kill the API
        try {
          await sendOutOfStockAlert(adminEmails, item.itemName);
        } catch (emailErr) {
          console.error("Email failed (out of stock):", emailErr);
        }

        await Alert.create({
          itemId: item._id,
          message: `${item.itemName} is out of stock.`
        });
      }
    } else if (item.quantity <= item.reorderThreshold) {
      if (!existingAlert) {
        try {
          await sendLowStockAlert(adminEmails, item.itemName, item.quantity);
        } catch (emailErr) {
          console.error("Email failed (low stock):", emailErr);
        }

        await Alert.create({
          itemId: item._id,
          message: `${item.itemName} is low on stock, current quantity: ${item.quantity}`
        });
      }
    }
  } catch (err) {
    console.error("checkAndNotify overall failed:", err);
  }
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

    await checkAndNotify(item);

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

    // Validation - Ensure we have clean data
    if (!itemName || isNaN(quantity) || isNaN(reorderThreshold)) {
      return res.status(400).json({ message: "Invalid input values" });
    }

    const item = await Item.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: "Item not found" });

    const store = await Store.findOne({ owner: req.user.id });
    const mode = store?.updateMode || "MANUAL";

    if (!item.updateLogs) item.updateLogs = [];

    if (mode === "MANUAL") {
      // MANUAL MODE: Update stock immediately
      item.itemName = itemName.trim();
      item.quantity = Number(quantity);
      item.reorderThreshold = Number(reorderThreshold);
      
      // Optional history log for record keeping
      item.updateLogs.push({ change: 0, note: "Manual Edit" }); 

      await checkAndNotify(item);
    } else {
      // EOD MODE: Calculate change without moving stock yet
      const targetQty = Number(quantity);
      
      const change = targetQty - item.quantity;

      item.updateLogs = [{ 
        change, 
        date: new Date(),
        note: `Pending update to ${targetQty}` 
      }];

      // Always update name and threshold immediately even in EOD mode
      item.itemName = itemName.trim();
      item.reorderThreshold = Number(reorderThreshold);
    }

    const updatedItem = await item.save();
    return res.status(200).json(updatedItem);

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await item.deleteOne();
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// EOD Apply Function
const applyEndOfDayUpdates = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });

    for (let item of items) {
      const totalChange = item.updateLogs.reduce((sum, log) => sum + log.change, 0);

      if (totalChange !== 0) {
        item.quantity += totalChange;
        item.updateLogs = [];
        await item.save();
        await checkAndNotify(item);
      }
    }

    res.status(200).json({ message: 'End-of-day updates applied' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply EOD updates' });
  }
};

// Export list
module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  applyEndOfDayUpdates
};