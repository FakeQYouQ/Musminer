// backend/models/index.js

import { Sequelize } from 'sequelize';
import config from '../config.js';

// Подключение к базе данных
const sequelize = new Sequelize(config.DATABASE_URL, {
    dialect: 'postgres',
    logging: false, // Уберите false, чтобы видеть SQL-запросы в логах
});

// Проверка подключения
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

export default sequelize;
