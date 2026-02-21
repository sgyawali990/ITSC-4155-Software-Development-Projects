const router = require('express').Router();
const {
  getAlerts,
  createAlert,
} = require('../controllers/alerts.controller');

// Public: just returns alerts
router.get('/', getAlerts);

// Later: authenticated route to add alerts
router.post('/', createAlert);

module.exports = router;