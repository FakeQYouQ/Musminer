import sequelize from '../models/index.js';
import User from '../models/user.js';

(async () => {
    try {
        const users = await User.findAll();
        for (const user of users) {
            user.dailyListeningTime = 0;
            user.achievements = {}; // Обнуляем историю треков
            await user.save();
        }
        console.log('Daily limits reset successfully.');
    } catch (error) {
        console.error('Error resetting daily limits:', error);
    } finally {
        await sequelize.close();
    }
})();
