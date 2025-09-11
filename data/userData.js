/**
 * User Data Layer
 * Data access layer for user operations
 * Follows MVC pattern: Controller -> Service -> Data
 * This layer handles data retrieval from databases, files, APIs, etc.
 */

// In-memory storage for demonstration (replace with actual database)
let users = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
    }
];

/**
 * Find all users
 * @returns {Promise<Array>} Array of users
 */
const findAllUsers = async () => {
    try {
        // Simulate database query
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...users]);
            }, 10);
        });
    } catch (error) {
        throw new Error(`Data layer error: ${error.message}`);
    }
};

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object|null>} User object or null
 */
const findUserById = async (id) => {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = users.find(u => u.id === id);
                resolve(user || null);
            }, 10);
        });
    } catch (error) {
        throw new Error(`Data layer error: ${error.message}`);
    }
};

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null
 */
const findUserByEmail = async (email) => {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = users.find(u => u.email === email);
                resolve(user || null);
            }, 10);
        });
    } catch (error) {
        throw new Error(`Data layer error: ${error.message}`);
    }
};

/**
 * Create new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
const createUser = async (userData) => {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    ...userData,
                    id: (users.length + 1).toString(),
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                users.push(newUser);
                resolve(newUser);
            }, 10);
        });
    } catch (error) {
        throw new Error(`Data layer error: ${error.message}`);
    }
};

/**
 * Update user by ID
 * @param {string} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object|null>} Updated user or null
 */
const updateUser = async (id, userData) => {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                const userIndex = users.findIndex(u => u.id === id);
                if (userIndex === -1) {
                    resolve(null);
                    return;
                }
                
                users[userIndex] = {
                    ...users[userIndex],
                    ...userData,
                    id: id,
                    updatedAt: new Date()
                };
                
                resolve(users[userIndex]);
            }, 10);
        });
    } catch (error) {
        throw new Error(`Data layer error: ${error.message}`);
    }
};

/**
 * Delete user by ID
 * @param {string} id - User ID
 * @returns {Promise<boolean>} Success status
 */
const deleteUser = async (id) => {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                const userIndex = users.findIndex(u => u.id === id);
                if (userIndex === -1) {
                    resolve(false);
                    return;
                }
                
                users.splice(userIndex, 1);
                resolve(true);
            }, 10);
        });
    } catch (error) {
        throw new Error(`Data layer error: ${error.message}`);
    }
};

module.exports = {
    findAllUsers,
    findUserById,
    findUserByEmail,
    createUser,
    updateUser,
    deleteUser
};