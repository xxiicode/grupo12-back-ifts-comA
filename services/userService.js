/**
 * User Service
 * Business logic layer for user operations
 * Follows MVC pattern: Controller -> Service -> Data
 */

const userData = require('../data/userData');
const User = require('../models/User');

/**
 * Get all users with business logic
 * @returns {Array} Array of users
 */
const getAllUsers = async () => {
    try {
        const users = await userData.findAllUsers();
        // Apply business logic here (filtering, sorting, etc.)
        return users.map(user => new User(user).toJSON());
    } catch (error) {
        throw new Error(`Service error: ${error.message}`);
    }
};

/**
 * Get user by ID with validation
 * @param {string} id - User ID
 * @returns {Object|null} User object or null if not found
 */
const getUserById = async (id) => {
    try {
        if (!id) {
            throw new Error('User ID is required');
        }
        
        const user = await userData.findUserById(id);
        return user ? new User(user).toJSON() : null;
    } catch (error) {
        throw new Error(`Service error: ${error.message}`);
    }
};

/**
 * Create new user with validation
 * @param {Object} userInfo - User information
 * @returns {Object} Created user
 */
const createUser = async (userInfo) => {
    try {
        // Create user instance for validation
        const user = new User(userInfo);
        const validation = user.validate();
        
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
        
        // Check if user already exists
        const existingUser = await userData.findUserByEmail(user.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        
        // Create user in data layer
        const createdUser = await userData.createUser(user.toJSON());
        return new User(createdUser).toJSON();
    } catch (error) {
        throw new Error(`Service error: ${error.message}`);
    }
};

/**
 * Update user with validation
 * @param {string} id - User ID
 * @param {Object} userInfo - Updated user information
 * @returns {Object|null} Updated user or null if not found
 */
const updateUser = async (id, userInfo) => {
    try {
        if (!id) {
            throw new Error('User ID is required');
        }
        
        // Check if user exists
        const existingUser = await userData.findUserById(id);
        if (!existingUser) {
            return null;
        }
        
        // Merge existing data with updates
        const updatedUserData = { ...existingUser, ...userInfo, id: id };
        const user = new User(updatedUserData);
        const validation = user.validate();
        
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
        
        // Update user in data layer
        const updatedUser = await userData.updateUser(id, user.toJSON());
        return updatedUser ? new User(updatedUser).toJSON() : null;
    } catch (error) {
        throw new Error(`Service error: ${error.message}`);
    }
};

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean} Success status
 */
const deleteUser = async (id) => {
    try {
        if (!id) {
            throw new Error('User ID is required');
        }
        
        const result = await userData.deleteUser(id);
        return result;
    } catch (error) {
        throw new Error(`Service error: ${error.message}`);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};