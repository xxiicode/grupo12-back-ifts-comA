/**
 * User Routes
 * Routes for user-related operations
 * Example of additional route structure following MVC pattern
 */

const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../controllers/userController');

/**
 * User routes
 * These routes follow the RESTful API pattern
 */

// GET /users - Get all users
router.get('/', userController.getAllUsers);

// GET /users/:id - Get user by ID
router.get('/:id', userController.getUserById);

// POST /users - Create new user
router.post('/', userController.createUser);

// PUT /users/:id - Update user by ID
router.put('/:id', userController.updateUser);

// DELETE /users/:id - Delete user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;