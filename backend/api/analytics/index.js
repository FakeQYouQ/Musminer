// backend/api/analytics/index.js

import express from 'express';
import { Op } from 'sequelize';
import Track from '../../models/track.js';
import User from '../../models/user.js';
import Transaction from '../../models/transaction.js';

const router = express.Router();

/**
 * Получить статистику воспроизведений по датам
 */
router.get('/plays', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const playsData = await Track.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('updatedAt')), 'playDate'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'playCount'],
            ],
            where: {
                updatedAt: {
                    [Op.between]: [new Date(startDate), new Date(endDate)],
                },
            },
            group: ['playDate'],
            order: [['playDate', 'ASC']],
        });

        res.status(200).json({ success: true, data: playsData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching play analytics.', error });
    }
});

/**
 * Анализ активности пользователей
 */
router.get('/users', async (req, res) => {
    try {
        const activeUsers = await User.findAll({
            attributes: [
                'id',
                'username',
                [sequelize.fn('COUNT', sequelize.col('tracks.id')), 'playCount'],
            ],
            include: {
                model: Track,
                as: 'tracks',
                attributes: [],
            },
            group: ['User.id'],
            order: [[sequelize.fn('COUNT', sequelize.col('tracks.id')), 'DESC']],
            limit: 10,
        });

        res.status(200).json({ success: true, data: activeUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user analytics.', error });
    }
});

/**
 * Расчёт доходов платформы
 */
router.get('/revenue', async (req, res) => {
    try {
        const platformRevenue = await Transaction.sum('amount', {
            where: { type: 'platform_fee' },
        });

        res.status(200).json({
            success: true,
            data: { platformRevenue },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error calculating platform revenue.', error });
    }
});

export default router;
