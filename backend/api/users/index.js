import express from 'express';
import User from '../../models/user.js';

const router = express.Router();

/**
 * Get all users
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users.', error });
    }
});

/**
 * Get user by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Проверка валидности ID (например, UUID)
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user.', error });
    }
});

/**
 * Create a new user
 */
router.post('/', async (req, res) => {
    try {
        const { username, balance = 0 } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'Username is required.' });
        }

        const user = await User.create({ username, balance });
        res.status(201).json({ message: 'User created successfully.', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user.', error });
    }
});

/**
 * Update user by ID
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Проверка валидности ID
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { balance, achievements } = req.body;
        if (balance !== undefined) user.balance = balance;
        if (achievements !== undefined) user.achievements = achievements;
        await user.save();

        res.status(200).json({ message: 'User updated successfully.', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user.', error });
    }
});

/**
 * Delete user by ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Проверка валидности ID
        if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
            return res.status(400).json({ message: 'Invalid user ID format.' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await user.destroy();
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user.', error });
    }
});

export default router;
