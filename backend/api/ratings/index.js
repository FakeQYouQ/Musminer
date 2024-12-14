// backend/api/ratings/index.js

import express from 'express';
import Track from '../../models/track.js';
import User from '../../models/user.js';

const router = express.Router();

/**
 * Получить топ треков по количеству воспроизведений.
 */
router.get('/tracks', async (req, res) => {
    try {
        const topTracks = await Track.findAll({
            attributes: ['id', 'title', 'artist', 'playCount'],
            order: [['playCount', 'DESC']],
            limit: 10,
        });
        res.status(200).json({ success: true, data: topTracks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching track ratings.', error });
    }
});

/**
 * Получить топ артистов по заработанным токенам.
 */
router.get('/artists', async (req, res) => {
    try {
        const topArtists = await User.findAll({
            attributes: ['id', 'username', 'balance'],
            order: [['balance', 'DESC']],
            where: { role: 'artist' },
            limit: 10,
        });
        res.status(200).json({ success: true, data: topArtists });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching artist ratings.', error });
    }
});

/**
 * Получить топ лейблов по общей сумме заработка артистов.
 */
router.get('/labels', async (req, res) => {
    try {
        const topLabels = await User.findAll({
            attributes: ['id', 'username', 'balance'],
            order: [['balance', 'DESC']],
            where: { role: 'label' },
            limit: 10,
        });
        res.status(200).json({ success: true, data: topLabels });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching label ratings.', error });
    }
});

export default router;
