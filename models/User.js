/**
 * User Model
 * Defines the structure and validation for User entities
 * In a real application, this would typically use an ORM like Sequelize or Mongoose
 */

class User {
    constructor(userData) {
        this.id = userData.id;
        this.name = userData.name;
        this.email = userData.email;
        this.createdAt = userData.createdAt || new Date();
        this.updatedAt = userData.updatedAt || new Date();
    }

    /**
     * Validate user data
     * @returns {Object} Validation result
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!this.email || !this.isValidEmail(this.email)) {
            errors.push('Valid email is required');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Check if email format is valid
     * @param {string} email 
     * @returns {boolean}
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Convert to JSON object
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = User;