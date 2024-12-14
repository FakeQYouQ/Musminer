// backend/middleware/checkBan.js
import User from '../models/user.js';

const checkBan = async (req, res, next) => {
    try {
        const userId = req.headers['user-id'];
        const user = await User.findByPk(userId);

        if (user && user.isBanned) {
            return res.status(403).json({ message: 'Your account is banned. Please contact support.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Error checking ban status.', error });
    }
};

export default checkBan;
