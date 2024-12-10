import sequelize from '../models/index.js';
import User from '../models/user.js';
import Track from '../models/track.js';

(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully.');

        const users = await Promise.all([
            User.create({ username: 'user1', balance: 100 }),
            User.create({ username: 'user2', balance: 200 }),
        ]);

        await Track.bulkCreate([
            { title: 'Track 1', artist: 'Artist 1', url: '/tracks/track1.mp3', duration: 180, userId: users[0].id },
            { title: 'Track 2', artist: 'Artist 2', url: '/tracks/track2.mp3', duration: 240, userId: users[1].id },
        ]);

        console.log('Test data added successfully.');
    } catch (error) {
        console.error('Error initializing the database:', error);
    } finally {
        await sequelize.close();
    }
})();
