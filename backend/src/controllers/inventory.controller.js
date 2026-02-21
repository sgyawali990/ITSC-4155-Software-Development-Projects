const Item = require('../models/Item');

exports.getInventory = async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch {
    res.status(500).json({ error: 'cannot fetch inventory' });
  }
};