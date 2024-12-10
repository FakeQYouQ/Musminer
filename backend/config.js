import dotenv from 'dotenv';

dotenv.config(); // Загружаем переменные окружения из .env

const config = {
    // Серверные настройки
    server: {
        PORT: process.env.PORT || 5000,
        NODE_ENV: process.env.NODE_ENV || 'development',
    },

    // PostgreSQL база данных
    database: {
        USER: process.env.DB_USER || 'defaultUser',
        PASSWORD: process.env.DB_PASSWORD || 'defaultPassword',
        HOST: process.env.DB_HOST || 'localhost',
        PORT: process.env.DB_PORT || 5432,
        NAME: process.env.DB_NAME || 'music_platform',
        URL: process.env.DATABASE_URL || null, // Альтернативный формат подключения
    },

    // MongoDB (если используется)
    mongo: {
        URL: process.env.MONGO_URL || 'mongodb://localhost:27017/music-platform',
    },

    // Безопасность
    security: {
        TOKEN_SECRET: process.env.TOKEN_SECRET || 'fallbackSuperSecretKey',
    },

    // Telegram API
    telegram: {
        BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
        API_URL: process.env.TELEGRAM_API_URL || 'https://api.telegram.org',
    },

    // Настройки токенов и блокчейна
    blockchain: {
        TOKEN_SYMBOL: process.env.MUSIC_TOKEN_SYMBOL || 'MUSIC',
        TON_WALLET_API: process.env.TON_WALLET_API || 'https://ton.org',
    },
};

// Предупреждения для обязательных переменных
const warnIfMissing = (key, message) => {
    if (!key) {
        console.warn(`Warning: ${message}`);
    }
};

warnIfMissing(process.env.TOKEN_SECRET, 'TOKEN_SECRET is missing. Using fallback value!');
warnIfMissing(process.env.DB_USER, 'DB_USER is missing. Database connection may fail.');
warnIfMissing(process.env.TELEGRAM_BOT_TOKEN, 'TELEGRAM_BOT_TOKEN is missing. Telegram functionality may not work.');

export default config;
