const expenseService = require('../services/expenseService');

const createExpense = async (req, res) => {
  try {
    const expense = await expenseService.createExpense(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getExpenses();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    await expenseService.deleteExpense(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createExpense, getExpenses, deleteExpense };
