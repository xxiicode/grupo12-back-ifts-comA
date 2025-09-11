/**
 * Index Controller
 * Handles HTTP requests and responses for index routes
 * Follows MVC pattern: Controller -> Service -> Data
 */

const indexService = require('../services/indexService');

/**
 * Get index page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getIndex = async (req, res) => {
    try {
        const data = await indexService.getWelcomeMessage();
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting index data',
            error: error.message
        });
    }
};

/**
 * Get health check
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getHealth = async (req, res) => {
    try {
        const healthData = await indexService.getHealthStatus();
        res.json({
            success: true,
            data: healthData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting health status',
            error: error.message
        });
    }
};

module.exports = {
    getIndex,
    getHealth
};