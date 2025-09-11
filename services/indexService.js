/**
 * Index Service
 * Business logic layer for index operations
 * Follows MVC pattern: Controller -> Service -> Data
 */

const indexData = require('../data/indexData');

/**
 * Get welcome message with business logic
 * @returns {Object} Welcome message data
 */
const getWelcomeMessage = async () => {
    try {
        // Business logic can be applied here
        const baseMessage = await indexData.getBaseMessage();
        
        return {
            message: baseMessage.text,
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development'
        };
    } catch (error) {
        throw new Error(`Service error: ${error.message}`);
    }
};

/**
 * Get health status with system checks
 * @returns {Object} Health status data
 */
const getHealthStatus = async () => {
    try {
        const systemInfo = await indexData.getSystemInfo();
        
        return {
            status: 'healthy',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            system: systemInfo,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        throw new Error(`Service error: ${error.message}`);
    }
};

module.exports = {
    getWelcomeMessage,
    getHealthStatus
};