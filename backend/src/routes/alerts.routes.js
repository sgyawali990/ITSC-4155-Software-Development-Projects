const router = require('express').Router();
const {
  getAlerts,
  createAlert,
} = require('../controllers/alerts.controller');

const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getAlerts);

router.post('/', protect, createAlert);

module.exports = router;