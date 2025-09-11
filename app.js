/**
 * Main Express server application
 * Entry point for the Node.js backend with MVC structure
 */

const express = require('express');
const app = express();

// Import routes
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', indexRoutes);
app.use('/api/users', userRoutes);

// Default route for undefined endpoints
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Server configuration
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;