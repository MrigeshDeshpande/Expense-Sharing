const Expense = require('../models/Expense');
const User = require('../models/User');
const { optimizeSettlements } = require('../utils/settlementOptimizer');

const getNetBalances = async () => {
  const users = await User.find();
  const expenses = await Expense.find();
  
  const balances = {};
  users.forEach(u => balances[u._id] = { name: u.name, netBalance: 0 });

  expenses.forEach(exp => {
    const payerId = exp.payer.toString();
    if (balances[payerId]) balances[payerId].netBalance += exp.amount;

    exp.splits.forEach(split => {
      const userId = split.user.toString();
      if (balances[userId]) balances[userId].netBalance -= split.amount;
    });
  });

  return Object.keys(balances).map(id => ({
    userId: id,
    name: balances[id].name,
    netBalance: Number(balances[id].netBalance.toFixed(2))
  }));
};

const getSettlements = async () => {
  const balances = await getNetBalances();
  return optimizeSettlements(balances);
};

module.exports = { getNetBalances, getSettlements };
