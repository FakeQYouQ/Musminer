import { DataTypes } from 'sequelize';
import sequelize from './index.js';
import User from './user.js';

const Track = sequelize.define('Track', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true, // Проверка URL
        },
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    playCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Счётчик воспроизведений
    },
},
   {
    tableName: 'tracks',
    timestamps: true,
    indexes: [{ fields: ['title', 'artist'] }],
});

Track.belongsTo(User, { foreignKey: 'userId', as: 'uploader' });

export default Track;
