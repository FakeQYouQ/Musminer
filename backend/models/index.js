// backend/models/index.js
import { Sequelize } from 'sequelize';
import config from '../config.js';

const { USER, PASSWORD, HOST, PORT, NAME } = config.database;

const sequelize = new Sequelize(NAME, USER, PASSWORD, {
    host: HOST,
    port: PORT,
    dialect: 'postgres',
    logging: config.server.NODE_ENV === 'development',
});

// Подключение моделей
import User from './user.js';
import Track from './track.js';
import Log from './log.js';
import Transaction from './transaction.js';

// Связи
User.hasMany(Track, { foreignKey: 'userId', as: 'tracks' });
Track.belongsTo(User, { foreignKey: 'userId', as: 'uploader' });

export { sequelize, User, Track, Log, Transaction };

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
