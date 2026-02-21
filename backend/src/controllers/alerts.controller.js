const Alert = require('../models/Alert');

// Placeholder: return all alerts
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({});
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

// Placeholder: create a dummy alert
exports.createAlert = async (req, res) => {
  try {
    const { itemId, message } = req.body;
    const alert = await Alert.create({ itemId, message });
    res.status(201).json({ alert });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
};