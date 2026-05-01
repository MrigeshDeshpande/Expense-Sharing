const Expense = require('../models/Expense');

const createExpense = async (data) => {
  const { amount, participants, splitType, customSplits } = data;
  let finalSplits = [];

  const totalAmount = Number(amount);

  if (splitType === 'EQUAL') {
    const count = participants.length;
    const splitAmount = Number((totalAmount / count).toFixed(2));
    
    finalSplits = participants.map((userId, index) => {
      let userShare;
      if (index === count - 1) {
        userShare = Number((totalAmount - (splitAmount * (count - 1))).toFixed(2));
      } else {
        userShare = splitAmount;
      }
      return { user: userId, amount: userShare };
    });
  } else {
    const sumOfCustom = customSplits.reduce((acc, s) => acc + Number(s.amount), 0);
    if (Math.abs(sumOfCustom - totalAmount) > 0.01) {
      throw new Error('Split total does not match expense amount');
    }
    finalSplits = customSplits.map(s => ({ user: s.user, amount: Number(Number(s.amount).toFixed(2)) }));
  }

  const expense = new Expense({ ...data, amount: totalAmount, splits: finalSplits });
  return await expense.save();
};

const getExpenses = async () => {
  return await Expense.find().populate('payer', 'name').populate('splits.user', 'name').sort({ createdAt: -1 });
};

const deleteExpense = async (id) => {
  return await Expense.findByIdAndDelete(id);
};

module.exports = { createExpense, getExpenses, deleteExpense };
