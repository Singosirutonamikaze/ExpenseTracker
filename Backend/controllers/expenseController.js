const xlsx = require("xlsx");
const Expense = require("../models/Expense");

//addExpense
exports.addExpense = async (req, res) => {
    const userId = req.user._id;

    try {
        const { icon, category, amount, date } = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const newExpense = new Expense({
            user: userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(201).json(newExpense);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

//getAllExpenses
exports.getAllExpenses = async (req, res) => {
    const userId = req.user._id;

    try {
        const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

//deleteExpense
exports.deleteExpense = async (req, res) => {
    const userId = req.user._id;
    const expenseId = req.params.id;

    try {
        const expense = await Expense.findOneAndDelete({ _id: expenseId, user: userId });
        if (!expense) {
            return res.status(404).json({ message: "Aucune dépense trouvée" });
        }
        res.status(200).json({ message: "Dépense Supprimée avec Succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


//downloadExpenseExcel
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user._id;

    try {
        const expenses = await Expense.find({ user: userId });
        if (expenses.length === 0) {
            return res.status(404).json({ message: "Aucune dépense trouvée" });
        }

        // Convert expenses to Excel format
        const data = expenses.map(expense => ({
            Category: expense.category,
            Amount: expense.amount,
            Date: expense.date.toISOString().split('T')[0],
        }));

        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Expenses");

        // Create unique filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `expenses_${timestamp}.xlsx`;

        // Write workbook to buffer
        const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.status(200).send(excelBuffer);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.error(error);
    }
}
