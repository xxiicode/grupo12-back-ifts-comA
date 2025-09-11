/**
 * Application Configuration
 * Main configuration settings for the application
 */

const config = {
    // Server configuration
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        cors: {
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }
    },

    // Security configuration
    security: {
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key-here',
        jwtExpiration: process.env.JWT_EXPIRATION || '24h',
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
        rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 minutes
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100
    },

    // API configuration
    api: {
        version: process.env.API_VERSION || 'v1',
        prefix: process.env.API_PREFIX || '/api',
        defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE) || 10,
        maxPageSize: parseInt(process.env.MAX_PAGE_SIZE) || 100
    },

    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined',
        file: process.env.LOG_FILE || 'logs/app.log'
    },

    // Environment configuration
    environment: {
        isDevelopment: process.env.NODE_ENV === 'development',
        isProduction: process.env.NODE_ENV === 'production',
        isTest: process.env.NODE_ENV === 'test'
    }
};

module.exports = config;