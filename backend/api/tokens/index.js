// backend/api/tokens/index.js
import express from 'express';
import { sequelize, User, Transaction, Log } from '../../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { userId, type, amount, description } = req.body;
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
            await t.rollback();
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!['earn', 'spend', 'platform_fee'].includes(type)) {
            await t.rollback();
            return res.status(400).json({ message: 'Invalid transaction type.' });
        }

        if (type === 'spend' && user.balance < amount) {
            await t.rollback();
            return res.status(400).json({ message: 'Insufficient balance.' });
        }

        user.balance += type === 'earn' ? amount : -amount;
        await user.save({ transaction: t });

        const transaction = await Transaction.create({
            userId,
            type,
            amount,
            description,
        }, { transaction: t });

        await Log.create({
            userId,
            action: 'transaction',
            details: { type, amount, description },
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Transaction successful.', transaction });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Error processing transaction.', error });
    }
});

export default router;
