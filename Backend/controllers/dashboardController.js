const Income = require('../models/Income');
const User = require('../models/User');
const Expense = require('../models/Expense');

exports.getDashboardData = async (req, res) => {
    let status = 200;
    let payload = {};
    try {
        const userId = req.user._id;
        const mongoose = require('mongoose');
        const { ObjectId } = mongoose.Types;
        let userObjectId;
        if (ObjectId.isValid(userId)) {
            try {
                userObjectId = new ObjectId(userId);
            } catch (e) {
                userObjectId = userId;
            }
        } else {
            userObjectId = userId;
        }

        // Match tolérant : ObjectId OU String
        const userMatch = { $or: [{ user: userObjectId }, { user: String(userId) }] };

        const totalIncome = await Income.aggregate([
            { $match: userMatch },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalExpense = await Expense.aggregate([
            { $match: userMatch },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const sixtyDaysAgo = new Date(Date.now() - (60 * 24 * 60 * 60 * 1000));
        const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));

        // Incomes sur 60 jours
        let last60DaysIncomeTransactions = await Income.find(userMatch).sort({ createdAt: -1 });
        last60DaysIncomeTransactions = last60DaysIncomeTransactions.filter(tx => {
            const txDate = tx.date ? new Date(tx.date) : null;
            const txCreated = tx.createdAt ? new Date(tx.createdAt) : null;
            return (txDate && txDate >= sixtyDaysAgo) || (txCreated && txCreated >= sixtyDaysAgo);
        });

        // Expenses sur 30 jours
        let last30DaysExpenseTransactions = await Expense.find(userMatch).sort({ createdAt: -1 });
        last30DaysExpenseTransactions = last30DaysExpenseTransactions.filter(tx => {
            const txDate = tx.date ? new Date(tx.date) : null;
            const txCreated = tx.createdAt ? new Date(tx.createdAt) : null;
            return (txDate && txDate >= thirtyDaysAgo) || (txCreated && txCreated >= thirtyDaysAgo);
        });

        // Derniers revenus/dépenses (sans filtre de date)
        const lastIncomeTransactions = await Income.find(userMatch).sort({ createdAt: -1 }).limit(10);
        const lastExpenseTransactions = await Expense.find(userMatch).sort({ createdAt: -1 }).limit(10);

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + (Number(transaction.amount) || 0), 0
        );
        const expenseLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + (Number(transaction.amount) || 0), 0
        );

        // Fusion et tri
        const lastTransactions = [
            ...lastIncomeTransactions.map(income => ({ ...income.toObject(), type: 'income' })),
            ...lastExpenseTransactions.map(expense => ({ ...expense.toObject(), type: 'expense' }))
        ].sort((a, b) => {
            const da = a.date ? new Date(a.date) : (a.createdAt ? new Date(a.createdAt) : new Date(0));
            const db = b.date ? new Date(b.date) : (b.createdAt ? new Date(b.createdAt) : new Date(0));
            return db - da;
        }).slice(0, 10);

        payload = {
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions
            },
            last30DaysExpenses: {
                total: expenseLast30Days,
                transactions: last30DaysExpenseTransactions
            },
            recentTransactions: lastTransactions
        };
    } catch (error) {
        console.error('Erreur de Recuperation de données:', error);
        status = 500;
        payload = { error: 'Internal server error' };
    }
    res.status(status).json(payload);
};
