const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const Income = require("../models/Income");

//addIncome
exports.addIncome = async (req, res) => {
   const userId = req.user._id;

   try {
       const { icon, source, amount, date } = req.body;

       if (!source || !amount || !date) {
           return res.status(400).json({ message: "Tous les champs sont requis" });
       }

       const newIncome = new Income({
           user: userId,
           icon,
           source,
           amount,
           date : new Date(date)
       });

       await newIncome.save();
       res.status(201).json(newIncome);

   } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Server error" });
   }
}

//getAllIncomes
exports.getAllIncomes = async (req, res) => {
    const userId = req.user._id;
    
    try {
        const incomes = await Income.find({ user: userId }).sort({ date: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

//deleteIncome
exports.deleteIncome = async (req, res) => {
    const userId = req.user._id;
    const incomeId = req.params.id;

    try {
        const income = await Income.findOneAndDelete({ _id: incomeId, user: userId });
        if (!income) {
            return res.status(404).json({ message: "Aucun revenu trouvé" });
        }
        res.status(200).json({ message: "Revenu Supprimé avec Succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


//downloadIncomeExcel
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user._id;

    try {
        const incomes = await Income.find({ user: userId });
        if (incomes.length === 0) {
            return res.status(404).json({ message: "Aucun revenu trouvé" });
        }

        // Convert incomes to Excel format
        const data = incomes.map(income => ({
            Source: income.source,
            Amount: income.amount,
            Date: income.date.toISOString().split('T')[0],
        }));

        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Incomes");

        // Create unique filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `incomes_${timestamp}.xlsx`;

        // Write workbook to buffer
        const excelBuffer = xlsx.write(workbook, { type: "buffer", bookType: "xlsx" });

        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.status(200).send(excelBuffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}
