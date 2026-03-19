const express = require('express');
const { getAlerts, createAlert } = require('../controllers/alerts.controller');

const router = express.Router();

router.get('/', getAlerts);
router.post('/', createAlert);

module.exports = router;