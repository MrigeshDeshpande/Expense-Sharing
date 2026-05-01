const Expense = require('../models/Expense');

exports.createExpense = async (req, res) => {
  try {
    const { description, amount, payer, participants, splitType, customSplits } = req.body;

    if (!description || !amount || !payer || !participants?.length) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    let splits = [];

    if (splitType === 'EQUAL') {
      const share = Number((amount / participants.length).toFixed(2));
      splits = participants.map(user => ({ user, amount: share }));
      
      const sum = splits.reduce((acc, s) => acc + s.amount, 0);
      const gap = Number((amount - sum).toFixed(2));
      if (gap) splits[0].amount = Number((splits[0].amount + gap).toFixed(2));
    } else {
      const sum = customSplits.reduce((acc, s) => acc + s.amount, 0);
      if (Math.abs(sum - amount) > 0.01) {
        return res.status(400).json({ message: 'Total mismatch' });
      }
      splits = customSplits;
    }

    const expense = await Expense.create({
      description,
      amount,
      payer,
      participants,
      splitType,
      splits
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('payer participants splits.user', 'name')
      .sort('-createdAt');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
