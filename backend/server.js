import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import config from './config.js'; // Конфигурации приложения
import authRoutes from './api/auth/index.js';
import tracksRoutes from './api/tracks/index.js';
import usersRoutes from './api/users/index.js';
import schedule from 'node-schedule';
import resetDailyLimits from './scripts/resetDailyLimits.js';

dotenv.config(); // Загрузка переменных окружения

const app = express();

// Middleware
app.use(cors());
app.use(helmet()); // Установка заголовков безопасности
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/auth', authRoutes);
app.use('/tracks', tracksRoutes);
app.use('/users', usersRoutes);

// Default route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Music platform backend is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = config.PORT || process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Запуск сброса ежедневных лимитов в 00:00
schedule.scheduleJob('0 0 * * *', async () => {
    console.log('Running daily reset job...');
    await import('./scripts/resetDailyLimits.js');
    console.log('Daily reset completed.');
});
