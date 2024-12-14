// backend/api/admin/index.js

import express from 'express';
import User from '../../models/user.js';
import Track from '../../models/track.js';

const router = express.Router();

/**
 * Получить всех пользователей
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'balance', 'role', 'isBanned'],
        });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users.', error });
    }
});

/**
 * Заблокировать пользователя
 */
router.put('/users/:id/ban', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.isBanned = true;
        await user.save();

        res.status(200).json({ success: true, message: 'User banned successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error banning user.', error });
    }
});

/**
 * Разблокировать пользователя
 */
router.put('/users/:id/unban', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.isBanned = false;
        await user.save();

        res.status(200).json({ success: true, message: 'User unbanned successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error unbanning user.', error });
    }
});

/**
 * Изменить роль пользователя
 */
router.put('/users/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'artist', 'label', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role specified.' });
        }

        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.role = role;
        await user.save();

        res.status(200).json({ success: true, message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating user role.', error });
    }
});

/**
 * Получить все треки
 */
router.get('/tracks', async (req, res) => {
    try {
        const tracks = await Track.findAll({
            attributes: ['id', 'title', 'artist', 'url', 'playCount'],
        });
        res.status(200).json({ success: true, data: tracks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching tracks.', error });
    }
});

/**
 * Удалить трек
 */
router.delete('/tracks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const track = await Track.findByPk(id);

        if (!track) return res.status(404).json({ success: false, message: 'Track not found' });

        await track.destroy();
        res.status(200).json({ success: true, message: 'Track deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting track.', error });
    }
});

/**
 * Получить статистику пользователей
 */
router.get('/stats/users', async (req, res) => {
    try {
        const totalUsers = await User.count();
        const bannedUsers = await User.count({ where: { isBanned: true } });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                bannedUsers,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user stats.', error });
    }
});

/**
 * Получить статистику треков
 */
router.get('/stats/tracks', async (req, res) => {
    try {
        const totalTracks = await Track.count();
        const totalPlayCount = await Track.sum('playCount');

        res.status(200).json({
            success: true,
            data: {
                totalTracks,
                totalPlayCount,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching track stats.', error });
    }
});

export default router;
