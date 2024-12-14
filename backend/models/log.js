// backend/models/log.js
import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Log = sequelize.define('Log', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: true, // Может быть null для системных событий
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    details: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: 'logs',
});

export default Log;
