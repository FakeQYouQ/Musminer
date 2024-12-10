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
        unique: true, // Уникальные имена пользователей
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
        defaultValue: 0, // Время прослушивания в секундах за день
    },
},
 {
    timestamps: true,
});

User.hasMany(Track, { foreignKey: 'userId', as: 'tracks' });

export default User;
