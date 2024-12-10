import { Sequelize } from 'sequelize';
import config from '../config.js';

// Используем секцию database из config
const { USER, PASSWORD, HOST, PORT, NAME } = config.database;

// Подключение к PostgreSQL
const sequelize = new Sequelize(NAME, USER, PASSWORD, {
    host: HOST,
    port: PORT,
    dialect: 'postgres',
    logging: config.server.NODE_ENV === 'development', // Логи SQL-запросов только в dev-режиме
});

// Проверка подключения
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

testConnection();

export default sequelize;
