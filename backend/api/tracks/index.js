// backend/api/tracks/index.js

import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Track from '../../models/track.js';
import User from '../../models/user.js';
import { sendTelegramMessage } from '../../services/telegramService.js';
import sequelize from '../../models/index.js';

const router = express.Router();

/**
 * Проверка лимитов воспроизведений для пользователя
 */
const checkLimits = (user, track, playHistory) => {
    const DAILY_LIMIT = 21600; // 6 часов
    const TRACK_LIMIT = 3; // Лимит воспроизведений одного трека за день

    if (user.dailyListeningTime >= DAILY_LIMIT) {
        throw new Error('Daily listening limit reached.');
    }

    if (playHistory[track.id] > TRACK_LIMIT) {
        throw new Error('Track play limit reached for the day.');
    }
};

/**
 * Получить все треки
 */
router.get('/', async (req, res) => {
    try {
        const tracks = await Track.findAll({
            attributes: ['id', 'title', 'artist', 'duration', 'url', 'playCount', 'userId'],
            include: { model: User, as: 'uploader', attributes: ['username'] },
        });
        res.status(200).json({ success: true, data: tracks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching tracks.', error });
    }
});

/**
 * Создать новый трек и уведомить подписчиков
 */
router.post('/upload', async (req, res) => {
    try {
        const { title, artist, duration, url, userId } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Создание трека
        const newTrack = await Track.create({ id: uuidv4(), title, artist, duration, url, userId });

        // Получение подписчиков
        const followers = await User.findAll({
            where: sequelize.literal(`achievements->'favorites' ? '${userId}'`),
            attributes: ['telegramChatId'],
        });

        const message = `Новый трек от артиста ${user.username}: "${title}". Слушайте сейчас!`;

        // Уведомление подписчиков
        for (const follower of followers) {
            if (follower.telegramChatId) {
                await sendTelegramMessage(follower.telegramChatId, message);
            }
        }

        res.status(201).json({ success: true, message: 'Track uploaded and notifications sent.', data: newTrack });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error uploading track.', error });
    }
});

/**
 * Получить треки пользователя
 */
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId, { include: { model: Track, as: 'tracks' } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        res.status(200).json({ success: true, data: user.tracks });
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

        const [track, user] = await Promise.all([
            Track.findByPk(id),
            User.findByPk(userId),
        ]);

        if (!track) return res.status(404).json({ success: false, message: 'Track not found.' });
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        // Обновление статистики пользователя и трека
        const playHistory = user.achievements || {};
        playHistory[track.id] = (playHistory[track.id] || 0) + 1;

        checkLimits(user, track, playHistory);

        const LISTENER_REWARD = 0.01;
        const ARTIST_REWARD = 0.001;

        user.balance += LISTENER_REWARD;
        user.dailyListeningTime += track.duration;
        user.achievements = playHistory;

        await user.save();

        if (track.userId) {
            const artist = await User.findByPk(track.userId);
            if (artist) {
                artist.balance += ARTIST_REWARD;
                await artist.save();
            }
        }

        track.playCount = (track.playCount || 0) + 1;
        await track.save();

        res.status(200).json({
            success: true,
            message: `Now playing: ${track.title}`,
            tokensEarned: LISTENER_REWARD,
            playCount: track.playCount,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

/**
 * Редактировать трек
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, artist, duration } = req.body;

        const track = await Track.findByPk(id);
        if (!track) return res.status(404).json({ success: false, message: 'Track not found.' });

        if (title) track.title = title;
        if (artist) track.artist = artist;
        if (duration) track.duration = duration;

        await track.save();

        res.status(200).json({ success: true, message: 'Track updated successfully.', data: track });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating track.', error });
    }
});

/**
 * Удалить трек
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const track = await Track.findByPk(id);
        if (!track) return res.status(404).json({ success: false, message: 'Track not found.' });

        await track.destroy();

        res.status(200).json({ success: true, message: 'Track deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting track.', error });
    }
});

export default router;
