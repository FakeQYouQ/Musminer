import sequelize from '../models/index.js';
import User from '../models/user.js';
import Track from '../models/track.js';
import Transaction from '../models/transaction.js';

(async () => {
    try {
        await sequelize.sync({ force: true }); // Удаляет и пересоздаёт таблицы
        console.log('Database synchronized successfully.');

        // Создание тестовых пользователей
        const users = await Promise.all([
            User.create({ username: 'user1', balance: 100 }),
            User.create({ username: 'user2', balance: 200 }),
        ]);

        // Создание тестовых треков
        await Track.bulkCreate([
            { title: 'Track 1', artist: 'Artist 1', url: '/tracks/track1.mp3', duration: 180, userId: users[0].id },
            { title: 'Track 2', artist: 'Artist 2', url: '/tracks/track2.mp3', duration: 240, userId: users[1].id },
        ]);

        // Создание тестовой транзакции
        await Transaction.create({
            userId: users[0].id,
            type: 'earn',
            amount: 10.0,
            description: 'Initial bonus for registration',
        });

        console.log('Test data added successfully.');
    } catch (error) {
        console.error('Error initializing the database:', error);
    } finally {
        await sequelize.close();
    }
})();
