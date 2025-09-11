/**
 * Database Configuration
 * Configuration settings for database connections
 */

const config = {
    development: {
        // MongoDB configuration
        mongodb: {
            uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/grupo13_dev',
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        },
        
        // MySQL configuration
        mysql: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'grupo13_dev',
            dialect: 'mysql'
        }
    },
    
    production: {
        // MongoDB configuration
        mongodb: {
            uri: process.env.MONGODB_URI,
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        },
        
        // MySQL configuration
        mysql: {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            dialect: 'mysql'
        }
    },
    
    test: {
        // Test database configurations
        mongodb: {
            uri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/grupo13_test',
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        },
        
        mysql: {
            host: process.env.DB_TEST_HOST || 'localhost',
            port: process.env.DB_TEST_PORT || 3306,
            username: process.env.DB_TEST_USERNAME || 'root',
            password: process.env.DB_TEST_PASSWORD || '',
            database: process.env.DB_TEST_NAME || 'grupo13_test',
            dialect: 'mysql'
        }
    }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];