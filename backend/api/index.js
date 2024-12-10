// backend/api/users/index.js

import express from 'express';

const router = express.Router();

// Temporary in-memory storage for users
const users = [
    { id: '1', username: 'user1', balance: 100, achievements: [] },
    { id: '2', username: 'user2', balance: 200, achievements: [] },
];

/**
 * Middleware for user ID validation
 */
router.param('id', (req, res, next, id) => {
    const user = users.find((u) => u.id === id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    req.user = user; // Attach the user to the request object
    next();
});

/**
 * Get user by ID
 */
router.get('/:id', (req, res) => {
    res.status(200).json(req.user);
});

/**
 * Update user data
 */
router.put('/:id', (req, res) => {
    const { balance, achievements } = req.body;

    // Validation
    if (balance !== undefined && typeof balance !== 'number') {
        return res.status(400).json({ message: 'Balance must be a number' });
    }
    if (achievements !== undefined && !Array.isArray(achievements)) {
        return res.status(400).json({ message: 'Achievements must be an array' });
    }

    if (balance !== undefined) req.user.balance = balance;
    if (achievements !== undefined) req.user.achievements = achievements;

    res.status(200).json({ message: 'User updated successfully', user: req.user });
});

/**
 * Get all users (for admin or testing)
 */
router.get('/', (req, res) => {
    res.status(200).json(users);
});

/**
 * Delete a user
 */
router.delete('/:id', (req, res) => {
    const userIndex = users.findIndex((u) => u.id === req.user.id);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        return res.status(200).json({ message: 'User deleted successfully' });
    }
    res.status(404).json({ message: 'User not found' });
});

export default router;
