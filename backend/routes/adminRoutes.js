const express = require('express');
const router = express.Router();
const { addAdmin } = require('../controllers/adminController');

// Add Admin
router.post('/', addAdmin); // Create an Admin

module.exports = router;
