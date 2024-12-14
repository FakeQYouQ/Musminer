// backend/server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import config from './config.js';
import authRoutes from './api/auth/index.js';
import tracksRoutes from './api/tracks/index.js';
import usersRoutes from './api/users/index.js';
import tokensRoutes from './api/tokens/index.js';
import ratingsRoutes from './api/ratings/index.js';
import adminRoutes from './api/admin/index.js'; // Подключение маршрутов для администраторов
import schedule from 'node-schedule';
import resetDailyLimits from './scripts/resetDailyLimits.js';
import checkBan from './middleware/checkBan.js';
import analyticsRoutes from './api/analytics/index.js'; // Добавить в список импортов

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/auth', authRoutes);
app.use('/tracks', checkBan, tracksRoutes); // Проверка на бан
app.use('/users', checkBan, usersRoutes);
app.use('/tokens', checkBan, tokensRoutes);
app.use('/ratings', ratingsRoutes);
app.use('/admin', adminRoutes); // Админ маршруты
app.use('/analytics', analyticsRoutes); // Добавить в подключение маршрутов

// Default route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Music platform backend is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Schedule task to reset daily limits
schedule.scheduleJob('0 0 * * *', () => {
    resetDailyLimits();
    console.log('Daily limits have been reset.');
});

// Start server
const PORT = config.PORT || process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
