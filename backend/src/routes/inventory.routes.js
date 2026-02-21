const router = require('express').Router();
const authMiddleware = require('../middleware/auth.middleware');
const { getInventory } = require('../controllers/inventory.controller');

router.get('/', authMiddleware, getInventory);

module.exports = router;