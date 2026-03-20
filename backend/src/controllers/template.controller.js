const Item = require('../models/Item');
const Store = require('../models/Store');
const businessTemplates = require('../config/businessTemplates');

// GET /templates for the frontend dropdown/cards
const getTemplates = async (req, res) => {
  try {
    const templates = Object.values(businessTemplates).map(t => ({
      key: t.key,
      label: t.label,
      description: t.description
    }));
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

// POST /templates/apply
const applyTemplate = async (req, res) => {
  try {
    const { templateKey, storeName } = req.body;

    const selectedTemplate = businessTemplates[templateKey];
    if (!selectedTemplate) {
      return res.status(400).json({ error: 'Invalid template selection' });
    }

    // Prevent duplicate setup
    const existingStore = await Store.findOne({ owner: req.user.id });
    if (existingStore) {
      return res.status(400).json({ error: 'User already has a store configured.' });
    }

    // Create the Store first
    const newStore = await Store.create({
      storeName: storeName || `${selectedTemplate.label} Store`,
      owner: req.user.id,
      businessType: templateKey,
      updateMode: selectedTemplate.defaults.updateMode // Sets MANUAL or EOD
    });

    // Prepare Items (mapped to the user)
    const starterItems = selectedTemplate.defaults.starterItems;
    const itemsToCreate = starterItems.map(item => ({
      itemName: item.itemName,
      quantity: item.quantity,
      reorderThreshold: item.reorderThreshold,
      category: item.category || 'General',
      user: req.user.id,
    }));

    // Bulk Insert Items
    await Item.insertMany(itemsToCreate);

    res.status(201).json({
      message: `${newStore.storeName} setup with ${selectedTemplate.label} template!`,
      itemsAdded: itemsToCreate.length,
      updateMode: newStore.updateMode
    });

  } catch (err) {
    console.error('TEMPLATE ERROR:', err);
    res.status(500).json({ error: err.message || 'Failed to apply template' });
  }
};

module.exports = {
  getTemplates,
  applyTemplate
};