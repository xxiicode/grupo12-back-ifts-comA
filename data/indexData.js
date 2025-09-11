/**
 * Index Data Layer
 * Data access layer for index operations
 * Follows MVC pattern: Controller -> Service -> Data
 * This layer handles data retrieval from databases, files, APIs, etc.
 */

/**
 * Get base welcome message
 * In a real application, this could fetch from a database
 * @returns {Object} Base message data
 */
const getBaseMessage = async () => {
    try {
        // Simulate database or external API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    text: 'Welcome to Grupo13 Backend API - IFTS ComA',
                    description: 'Node.js + Express MVC Backend Structure'
                });
            }, 10); // Simulate async operation
        });
    } catch (error) {
        throw new Error(`Data layer error: ${error.message}`);
    }
};

/**
 * Get system information
 * In a real application, this could fetch from monitoring services
 * @returns {Object} System information
 */
const getSystemInfo = async () => {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    platform: process.platform,
                    arch: process.arch,
                    nodeVersion: process.version,
                    pid: process.pid
                });
            }, 10); // Simulate async operation
        });
    } catch (error) {
        throw new Error(`Data layer error: ${error.message}`);
    }
};

module.exports = {
    getBaseMessage,
    getSystemInfo
};