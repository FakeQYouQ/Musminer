import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config.js';

const router = express.Router();

// Temporary user storage (should be replaced with DB)
const users = {};

/**
 * Telegram Login Route
 * Handles authentication via Telegram login widget.
 */
router.post('/login', (req, res) => {
    const { userId, username } = req.body;

    if (!userId || !username || typeof userId !== 'string' || typeof username !== 'string') {
        return res.status(400).json({ message: 'Invalid Telegram data' });
    }

    // Check if user exists
    if (!users[userId]) {
        // Create new user with default balance
        users[userId] = { userId, username, balance: 0 };
    }

    // Generate JWT token
    const token = jwt.sign({ userId, username }, config.TOKEN_SECRET, { expiresIn: '7d' });

    res.status(200).json({
        message: 'Login successful',
        token,
        user: { userId, username }, // Exclude sensitive data
    });
});

/**
 * Token Validation Route
 * Verifies if the provided token is valid.
 */
router.get('/validate-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.TOKEN_SECRET);
        res.status(200).json({ message: 'Token is valid', user: decoded });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

export default router;
