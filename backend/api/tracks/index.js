import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Track from '../../models/track.js';
import User from '../../models/user.js';

const router = express.Router();

/**
 * Получение всех треков
 */
router.get('/', async (req, res) => {
    try {
        const tracks = await Track.findAll({
            attributes: ['id', 'title', 'artist', 'duration', 'userId'],
            include: { model: User, as: 'uploader', attributes: ['username'] },
        });
        res.status(200).json({ success: true, data: tracks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching tracks.', error });
    }
});

/**
 * Загрузка нового трека
 */
router.post('/upload', async (req, res) => {
    try {
        const { title, artist, duration, url, userId } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const duplicate = await Track.findOne({ where: { title, artist, userId } });
        if (duplicate) {
            return res.status(400).json({ success: false, message: 'Track already exists.' });
        }

        const newTrack = await Track.create({
            id: uuidv4(),
            title,
            artist,
            duration,
            url,
            userId,
        });

        res.status(201).json({ success: true, message: 'Track uploaded successfully.', data: newTrack });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error uploading track.', error });
    }
});

/**
 * Получение треков пользователя
 */
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId, { include: { model: Track, as: 'tracks' } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, data: { username: user.username, tracks: user.tracks } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user tracks.', error });
    }
});

/**
 * Воспроизведение трека и начисление токенов
 */
router.get('/:id/play', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.query;

        const track = await Track.findByPk(id);
        if (!track) {
            return res.status(404).json({ success: false, message: 'Track not found.' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const DAILY_LIMIT = 21600; // 6 часов
        const TRACK_LIMIT = 3; // Лимит воспроизведений трека
        const LISTENER_REWARD = 0.01;
        const ARTIST_REWARD = 0.001;

        if (user.dailyListeningTime >= DAILY_LIMIT) {
            return res.status(403).json({ success: false, message: 'Daily listening limit reached.' });
        }

        const playHistory = user.achievements || {};
        playHistory[track.id] = (playHistory[track.id] || 0) + 1;

        if (playHistory[track.id] > TRACK_LIMIT) {
            return res.status(403).json({ success: false, message: 'Track play limit reached for the day.' });
        }

        // Начисление токенов
        user.balance += LISTENER_REWARD;
        user.dailyListeningTime += track.duration;
        user.achievements = playHistory;
        await user.save();

        const artist = await User.findByPk(track.userId);
        if (artist) {
            artist.balance += ARTIST_REWARD;
            await artist.save();
        }

        track.playCount += 1;
        await track.save();

        res.status(200).json({
            success: true,
            message: `Now playing: ${track.title}`,
            tokensEarned: LISTENER_REWARD,
            playCount: track.playCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error playing track.', error });
    }
});

export default router;
