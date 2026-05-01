const Expense = require('../models/Expense');
const User = require('../models/User');
const { optimizeSettlements } = require('../utils/settlementOptimizer');

exports.getBalances = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const users = await User.find();
    const balances = {};

    users.forEach(user => {
      balances[user._id] = 0;
    });

    expenses.forEach(expense => {
      balances[expense.payer] += expense.amount;
      expense.splits.forEach(split => {
        balances[split.user] -= split.amount;
      });
    });

    const result = users.map(user => ({
      userId: user._id,
      name: user.name,
      netBalance: Number(balances[user._id].toFixed(2))
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSettlements = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const users = await User.find();
    const balances = {};

    users.forEach(user => {
      balances[user._id] = 0;
    });

    expenses.forEach(expense => {
      balances[expense.payer] += expense.amount;
      expense.splits.forEach(split => {
        balances[split.user] -= split.amount;
      });
    });

    const settlements = optimizeSettlements(balances);
    
    const detailedSettlements = settlements.map(s => ({
      from: users.find(u => u._id.toString() === s.from)?.name || s.from,
      to: users.find(u => u._id.toString() === s.to)?.name || s.to,
      amount: s.amount
    }));

    res.json(detailedSettlements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
