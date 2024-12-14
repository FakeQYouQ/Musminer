// backend/models/user.js

import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import Track from './track.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    achievements: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    dailyListeningTime: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    role: {
        type: DataTypes.ENUM('user', 'artist', 'label', 'admin'),
        defaultValue: 'user',
    },
    isBanned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    telegramChatId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
});

User.hasMany(Track, { foreignKey: 'userId', as: 'tracks' });

export default User;
