/**
 * Index routes
 * Main routes for the application
 */

const express = require('express');
const router = express.Router();

// Import controllers
const indexController = require('../controllers/indexController');

// Define routes
router.get('/', indexController.getIndex);
router.get('/health', indexController.getHealth);

module.exports = router;