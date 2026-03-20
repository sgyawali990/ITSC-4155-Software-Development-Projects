const router = require('express').Router();
const { getTemplates, applyTemplate } = require('../controllers/template.controller');

const { protect } = require('../middleware/auth.middleware'); 

router.get('/', getTemplates);

router.post('/apply', protect, applyTemplate); 

module.exports = router;