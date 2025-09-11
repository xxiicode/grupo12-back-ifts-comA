/**
 * User Controller
 * Handles HTTP requests and responses for user operations
 * Follows MVC pattern: Controller -> Service -> Data
 */

const userService = require('../services/userService');
const { successResponse, errorResponse } = require('../views/apiViews');

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(successResponse(users, 'Users retrieved successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error retrieving users', error.message));
    }
};

/**
 * Get user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getUserById(id);
        
        if (!user) {
            return res.status(404).json(errorResponse('User not found', null, 404));
        }
        
        res.json(successResponse(user, 'User retrieved successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error retrieving user', error.message));
    }
};

/**
 * Create new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await userService.createUser(userData);
        res.status(201).json(successResponse(newUser, 'User created successfully'));
    } catch (error) {
        res.status(400).json(errorResponse('Error creating user', error.message, 400));
    }
};

/**
 * Update user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;
        const updatedUser = await userService.updateUser(id, userData);
        
        if (!updatedUser) {
            return res.status(404).json(errorResponse('User not found', null, 404));
        }
        
        res.json(successResponse(updatedUser, 'User updated successfully'));
    } catch (error) {
        res.status(400).json(errorResponse('Error updating user', error.message, 400));
    }
};

/**
 * Delete user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.deleteUser(id);
        
        if (!result) {
            return res.status(404).json(errorResponse('User not found', null, 404));
        }
        
        res.json(successResponse(null, 'User deleted successfully'));
    } catch (error) {
        res.status(500).json(errorResponse('Error deleting user', error.message));
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};