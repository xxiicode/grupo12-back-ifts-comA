/**
 * API Response Views
 * Helper functions to format API responses consistently
 * This layer handles response formatting and data presentation
 */

/**
 * Format success response
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @returns {Object} Formatted success response
 */
const successResponse = (data, message = 'Operation successful') => {
    return {
        success: true,
        message: message,
        data: data,
        timestamp: new Date().toISOString()
    };
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {*} errors - Error details
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted error response
 */
const errorResponse = (message, errors = null, statusCode = 500) => {
    const response = {
        success: false,
        message: message,
        timestamp: new Date().toISOString()
    };

    if (errors) {
        response.errors = errors;
    }

    response.statusCode = statusCode;
    
    return response;
};

/**
 * Format paginated response
 * @param {Array} data - Array of data items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Formatted paginated response
 */
const paginatedResponse = (data, page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    
    return {
        success: true,
        data: data,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        },
        timestamp: new Date().toISOString()
    };
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse
};